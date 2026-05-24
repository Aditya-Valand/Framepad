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
  const { designIds, productTypeId, sizeId, finishId, addressId, couponId, isGift, giftMessage } = body;

  // Validate inputs
  if (!Array.isArray(designIds) || designIds.length === 0 || designIds.length > 20)
    return err('1-20 designs required', 400);
  if (!productTypeId || !sizeId || !finishId) return err('Missing print options', 400);
  if (!addressId) return err('Shipping address required', 400);

  // Verify designs belong to user
  const designs = await sql`
    SELECT id FROM designs WHERE id = ANY(${designIds}) AND user_id = ${uid} AND deleted_at IS NULL`;
  if (designs.length !== designIds.length) return err('Invalid designs', 400);

  // Verify address belongs to user
  const [addr] = await sql`SELECT id FROM addresses WHERE id = ${addressId} AND user_id = ${uid}`;
  if (!addr) return err('Invalid address', 400);

  // Fetch pricing data
  const [productType] = await sql`SELECT * FROM product_types WHERE id = ${productTypeId} AND is_active = true`;
  if (!productType) return err('Invalid product type', 400);

  const [size] = await sql`SELECT * FROM print_sizes WHERE id = ${sizeId} AND is_active = true`;
  const [finish] = await sql`SELECT * FROM print_finishes WHERE id = ${finishId} AND is_active = true`;
  if (!size || !finish) return err('Invalid size or finish', 400);

  // Calculate price server-side (authoritative)
  const numDesigns = designIds.length;
  const tiersNeeded = Math.ceil(numDesigns / productType.quantity);
  const basePaise = productType.base_price_paise * tiersNeeded;
  const sizeAddon = size.price_addon_paise * numDesigns;
  const finishAddon = finish.price_addon_paise * numDesigns;
  const subtotal = basePaise + sizeAddon + finishAddon;

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
      // Check limits
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
  const freeThreshold = setting?.value ? parseInt(JSON.stringify(setting.value).replace(/"/g, '')) : 50000;
  const shippingPaise = subtotal >= freeThreshold ? 0 : 4900;

  const totalPaise = subtotal - discountPaise + shippingPaise;
  const unitPricePaise = Math.round(totalPaise / numDesigns);

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

    // Create order items
    for (const designId of designIds) {
      await sql`
        INSERT INTO order_items (
          order_id, design_id, product_type_id, print_finish_id, print_size_id,
          quantity, unit_price_paise, total_price_paise
        ) VALUES (
          ${order.id}, ${designId}, ${productTypeId}, ${finishId}, ${sizeId},
          1, ${unitPricePaise}, ${unitPricePaise}
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
