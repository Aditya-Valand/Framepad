import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A21 — Coupon List
// GET /api/admin/coupons
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const coupons = await sql`
      SELECT
        id,
        code,
        description,
        type,
        value,
        min_order_paise,
        max_discount_paise,
        total_usage_limit,
        usage_count,
        per_user_limit,
        applicable_to,
        valid_from,
        valid_until,
        is_active,
        created_at,
        CASE
          WHEN valid_until IS NOT NULL AND valid_until < NOW() THEN 'expired'
          WHEN NOT is_active                                   THEN 'disabled'
          ELSE 'active'
        END AS current_status
      FROM coupons
      ORDER BY created_at DESC
    `;

    const total    = coupons.length;
    const active   = coupons.filter((c: Record<string, unknown>) => c.current_status === 'active').length;
    const expired  = coupons.filter((c: Record<string, unknown>) => c.current_status === 'expired').length;
    const disabled = coupons.filter((c: Record<string, unknown>) => c.current_status === 'disabled').length;

    return ok({
      coupons: coupons.map((c: Record<string, unknown>) => ({
        id:               c.id,
        code:             c.code,
        description:      c.description,
        type:             c.type,
        value:            Number(c.value),
        minOrderPaise:    Number(c.min_order_paise),
        maxDiscountPaise: c.max_discount_paise != null ? Number(c.max_discount_paise) : null,
        totalUsageLimit:  c.total_usage_limit  != null ? Number(c.total_usage_limit)  : null,
        usageCount:       Number(c.usage_count),
        perUserLimit:     Number(c.per_user_limit),
        applicableTo:     c.applicable_to,
        validFrom:        c.valid_from,
        validUntil:       c.valid_until,
        isActive:         c.is_active,
        createdAt:        c.created_at,
        status:           c.current_status,
      })),
      counts: { total, active, expired, disabled },
    });
  } catch (error) {
    console.error('Coupons list error:', error);
    return err('Failed to fetch coupons', 500);
  }
}

// A20 — Create Coupon
// POST /api/admin/coupons
export async function POST(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const body = await req.json();
    const {
      code: rawCode,
      type,
      value,
      minOrderPaise   = 0,
      maxDiscountPaise,
      totalUsageLimit,
      perUserLimit    = 1,
      applicableTo    = 'all',
      validFrom,
      validUntil,
      description,
      isActive        = true,
    } = body;

    // Validate code
    const code = String(rawCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length < 3 || code.length > 50) {
      return err('Code must be 3–50 alphanumeric characters', 400);
    }

    // Validate type
    const validTypes = ['percentage', 'fixed_amount', 'free_shipping', 'free_gift_box'];
    if (!validTypes.includes(type)) {
      return err('Invalid coupon type', 400);
    }

    // Validate value
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return err('Invalid value', 400);
    if (type === 'percentage' && numValue > 100) return err('Percentage cannot exceed 100', 400);

    // Validate applicable_to
    const validApplicable = ['all', 'first_order', 'event'];
    if (!validApplicable.includes(applicableTo)) return err('Invalid applicableTo', 400);

    // Check duplicate
    const [existing] = await sql`SELECT id FROM coupons WHERE code = ${code}`;
    if (existing) return err('Coupon code already exists', 409);

    const [coupon] = await sql`
      INSERT INTO coupons (
        code, description, type, value,
        min_order_paise, max_discount_paise,
        total_usage_limit, per_user_limit,
        applicable_to, valid_from, valid_until,
        is_active, created_by
      ) VALUES (
        ${code},
        ${description || null},
        ${type},
        ${numValue},
        ${Number(minOrderPaise)},
        ${maxDiscountPaise != null ? Number(maxDiscountPaise) : null},
        ${totalUsageLimit  != null ? Number(totalUsageLimit)  : null},
        ${Number(perUserLimit)},
        ${applicableTo},
        ${validFrom  || new Date().toISOString()},
        ${validUntil || null},
        ${Boolean(isActive)},
        ${adminId}
      )
      RETURNING id, code, type, value, is_active
    `;

    return ok(coupon, 201);
  } catch (error) {
    console.error('Create coupon error:', error);
    return err('Failed to create coupon', 500);
  }
}
