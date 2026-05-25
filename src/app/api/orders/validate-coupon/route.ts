import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { code, subtotalPaise } = await req.json();
  if (!code) return err('Code required', 400);

  const [coupon] = await sql`
    SELECT * FROM coupons
    WHERE code = ${code.toUpperCase().trim()}
      AND is_active = true
      AND valid_from <= NOW()
      AND (valid_until IS NULL OR valid_until >= NOW())`;

  if (!coupon) return ok({ valid: false, reason: 'Invalid or expired coupon' });

  // Check usage limits
  if (coupon.total_usage_limit && coupon.usage_count >= coupon.total_usage_limit)
    return ok({ valid: false, reason: 'Coupon usage limit reached' });

  const [usage] = await sql`
    SELECT COUNT(*)::int as n FROM coupon_usages
    WHERE coupon_id = ${coupon.id} AND user_id = ${uid}`;
  if (usage.n >= coupon.per_user_limit)
    return ok({ valid: false, reason: 'You have already used this coupon' });

  // Min order check
  if (subtotalPaise < (coupon.min_order_paise || 0))
    return ok({ valid: false, reason: `Minimum order ₹${((coupon.min_order_paise || 0) / 100).toFixed(0)} required` });

  // Calculate discount
  let discountPaise = 0;
  if (coupon.type === 'percentage') {
    discountPaise = Math.round(subtotalPaise * coupon.value / 100);
    if (coupon.max_discount_paise) discountPaise = Math.min(discountPaise, coupon.max_discount_paise);
  } else if (coupon.type === 'fixed_amount') {
    discountPaise = coupon.value;
  } else if (coupon.type === 'free_shipping') {
    discountPaise = 4900;
  }

  return ok({
    valid: true,
    discountPaise,
    couponId: coupon.id,
    type: coupon.type,
    description: coupon.description,
  });
}
