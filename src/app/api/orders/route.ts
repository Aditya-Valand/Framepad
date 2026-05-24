import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const orders = await sql`
    SELECT o.id, o.order_number, o.status, o.total_paise, o.is_gift,
           o.created_at, o.confirmed_at, o.estimated_delivery_at,
           (SELECT COUNT(*)::int FROM order_items WHERE order_id = o.id) as item_count,
           s.tracking_number, s.carrier, s.tracking_url
    FROM orders o
    LEFT JOIN shipments s ON s.order_id = o.id
    WHERE o.user_id = ${uid}
    ORDER BY o.created_at DESC`;

  return ok({ orders });
}

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { designIds, finishId, addressId, couponId, wantGiftBox, isGift, giftMessage } = body;

  // Validate inputs
  if (!Array.isArray(designIds) || designIds.length === 0 || designIds.length > 20)
    return err('1-20 designs required', 400);
  if (!finishId) return err('Missing finish selection', 400);
  if (!addressId) return err('Shipping address required', 400);

  // Verify designs belong to user and get their template_id from canvas_state
  const rawDesigns = await sql`
    SELECT id, template_id, canvas_state, export_url, thumbnail_url FROM designs
    WHERE id = ANY(${designIds}) AND user_id = ${uid} AND deleted_at IS NULL`;
  if (rawDesigns.length !== designIds.length) return err('Invalid designs', 400);
  // Extract template slug from canvas_state (slug like 'concert-ticket')
  const designs = rawDesigns.map(d => ({
    id: d.id,
    template_id: d.canvas_state?.frameData?.templateId || d.template_id || null,
    snapshotUrl: (d.export_url || d.thumbnail_url || null) as string | null,
  }));

  // Verify address belongs to user
  const [addr] = await sql`SELECT id FROM addresses WHERE id = ${addressId} AND user_id = ${uid}`;
  if (!addr) return err('Invalid address', 400);

  // Fetch finish
  const [finish] = await sql`SELECT * FROM print_finishes WHERE id = ${finishId} AND is_active = true`;
  if (!finish) return err('Invalid finish', 400);

  // Fetch template pricing
  const templatePricing = await sql`SELECT * FROM template_print_mapping WHERE is_active = true`;
  const pricingMap: Record<string, { first_print_paise: number; extra_print_paise: number; print_size_id: string }> = {};
  for (const tp of templatePricing) {
    pricingMap[tp.template_id] = {
      first_print_paise: tp.first_print_paise,
      extra_print_paise: tp.extra_print_paise,
      print_size_id: tp.print_size_id,
    };
  }

  // Fetch bundles
  const allBundles = await sql`SELECT * FROM price_bundles WHERE is_active = true ORDER BY quantity DESC`;
  const bundlesByTemplate: Record<string, { quantity: number; price_paise: number }[]> = {};
  for (const b of allBundles) {
    if (!bundlesByTemplate[b.template_id]) bundlesByTemplate[b.template_id] = [];
    bundlesByTemplate[b.template_id].push({ quantity: b.quantity, price_paise: b.price_paise });
  }

  // Group designs by template type
  const typeGroups: Record<string, { ids: string[]; printSizeId: string }> = {};
  const fallbackKey = Object.keys(pricingMap)[0] || 'polaroid-classic';

  for (const d of designs) {
    const key = pricingMap[d.template_id] ? d.template_id : fallbackKey;
    if (!typeGroups[key]) typeGroups[key] = { ids: [], printSizeId: pricingMap[key]?.print_size_id || '' };
    typeGroups[key].ids.push(d.id);
  }

  // Calculate: best bundle + extras, or individual pricing
  let printsPaise = 0;
  const designPrices: { id: string; unitPrice: number; printSizeId: string }[] = [];

  for (const [templateId, group] of Object.entries(typeGroups)) {
    const tp = pricingMap[templateId];
    const count = group.ids.length;
    const templateBundles = bundlesByTemplate[templateId] || [];
    // Find best bundle (largest qty that fits)
    const bestBundle = templateBundles.find(b => b.quantity <= count);

    if (bestBundle) {
      // Bundle covers first N items, extras use extra_print_paise
      const extraCount = count - bestBundle.quantity;
      const groupTotal = bestBundle.price_paise + extraCount * tp.extra_print_paise;
      printsPaise += groupTotal;
      // Distribute price across items for order_items records
      const bundlePerUnit = Math.round(bestBundle.price_paise / bestBundle.quantity);
      group.ids.forEach((id, idx) => {
        const unitPrice = idx < bestBundle.quantity ? bundlePerUnit : tp.extra_print_paise;
        designPrices.push({ id, unitPrice, printSizeId: group.printSizeId });
      });
    } else {
      // Individual pricing: first = first_print_paise, rest = extra_print_paise
      group.ids.forEach((id, idx) => {
        const unitPrice = idx === 0 ? tp.first_print_paise : tp.extra_print_paise;
        printsPaise += unitPrice;
        designPrices.push({ id, unitPrice, printSizeId: group.printSizeId });
      });
    }
  }

  // Finish addon
  const finishAddon = finish.price_addon_paise * designIds.length;

  // Gift box
  const [giftBoxSetting] = await sql`SELECT value FROM site_settings WHERE key = 'gift_box_addon_paise'`;
  const giftBoxPaise = wantGiftBox ? parseInt(String(giftBoxSetting?.value || '14900').replace(/"/g, '')) : 0;

  const subtotal = printsPaise + finishAddon + giftBoxPaise;

  // Coupon validation
  let discountPaise = 0;
  let validCouponId: string | null = null;
  if (couponId) {
    const [coupon] = await sql`
      SELECT * FROM coupons
      WHERE id = ${couponId} AND is_active = true
        AND valid_from <= NOW()
        AND (valid_until IS NULL OR valid_until >= NOW())`;

    if (coupon) {
      const [usage] = await sql`
        SELECT COUNT(*)::int as n FROM coupon_usages
        WHERE coupon_id = ${coupon.id} AND user_id = ${uid}`;

      if (usage.n < coupon.per_user_limit &&
          (!coupon.total_usage_limit || coupon.usage_count < coupon.total_usage_limit) &&
          subtotal >= (coupon.min_order_paise || 0)) {
        if (coupon.type === 'percentage') {
          discountPaise = Math.round(subtotal * coupon.value / 100);
          if (coupon.max_discount_paise) discountPaise = Math.min(discountPaise, coupon.max_discount_paise);
        } else if (coupon.type === 'fixed_amount') {
          discountPaise = coupon.value;
        } else if (coupon.type === 'free_shipping') {
          discountPaise = 4900;
        }
        validCouponId = coupon.id;
      }
    }
  }

  // Shipping
  const [setting] = await sql`SELECT value FROM site_settings WHERE key = 'free_shipping_threshold_paise'`;
  const freeThreshold = setting?.value ? parseInt(String(setting.value).replace(/"/g, '')) : 50000;
  const shippingPaise = subtotal >= freeThreshold ? 0 : 4900;

  const totalPaise = subtotal - discountPaise + shippingPaise;

  // Create order in transaction
  try {
    await sql`BEGIN`;

    const [order] = await sql`
      INSERT INTO orders (
        user_id, subtotal_paise, discount_paise, shipping_paise, total_paise,
        order_type, shipping_address_id, coupon_id, is_gift
      ) VALUES (
        ${uid}, ${subtotal}, ${discountPaise}, ${shippingPaise}, ${totalPaise},
        ${isGift ? 'gift' : 'standard'}, ${addressId}, ${validCouponId}, ${!!isGift}
      ) RETURNING id, order_number`;

    // Create order items — each design with its own pricing
    const [defaultPt] = await sql`SELECT id FROM product_types WHERE slug = 'single' LIMIT 1`;
    const [defaultSize] = await sql`SELECT id FROM print_sizes WHERE is_default = true LIMIT 1`;

    for (const dp of designPrices) {
      const unitTotal = dp.unitPrice + finish.price_addon_paise;
      const design = designs.find(d => d.id === dp.id);
      await sql`
        INSERT INTO order_items (
          order_id, design_id, product_type_id, print_finish_id, print_size_id,
          quantity, unit_price_paise, total_price_paise, design_snapshot_url
        ) VALUES (
          ${order.id}, ${dp.id}, ${defaultPt?.id || null}, ${finishId},
          ${dp.printSizeId || defaultSize?.id || null},
          1, ${unitTotal}, ${unitTotal}, ${design?.snapshotUrl || null}
        )`;
    }

    // Gift message
    if (isGift && giftMessage) {
      await sql`
        INSERT INTO gift_messages (order_id, from_name, message)
        VALUES (${order.id}, ${''}, ${giftMessage})`;
    }

    // Record coupon usage
    if (validCouponId && discountPaise > 0) {
      await sql`
        INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_applied_paise)
        VALUES (${validCouponId}, ${uid}, ${order.id}, ${discountPaise})`;
      await sql`
        UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ${validCouponId}`;
    }

    await sql`COMMIT`;
    return ok({ id: order.id, orderNumber: order.order_number, totalPaise }, 201);
  } catch (e) {
    await sql`ROLLBACK`;
    console.error('[POST /api/orders]', e);
    return err('Failed to create order', 500);
  }
}
