import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// PATCH /api/admin/coupons/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      description     = null,
      value,
      minOrderPaise   = 0,
      maxDiscountPaise = null,
      totalUsageLimit  = null,
      perUserLimit    = 1,
      applicableTo    = 'all',
      validFrom,
      validUntil      = null,
      isActive        = true,
    } = body;

    const [existing] = await sql`SELECT id FROM coupons WHERE id = ${id}`;
    if (!existing) return err('Coupon not found', 404);

    const [updated] = await sql`
      UPDATE coupons SET
        description        = ${description},
        value              = ${Number(value)},
        min_order_paise    = ${Number(minOrderPaise)},
        max_discount_paise = ${maxDiscountPaise != null ? Number(maxDiscountPaise) : null},
        total_usage_limit  = ${totalUsageLimit  != null ? Number(totalUsageLimit)  : null},
        per_user_limit     = ${Number(perUserLimit)},
        applicable_to      = ${applicableTo},
        valid_from         = ${validFrom},
        valid_until        = ${validUntil},
        is_active          = ${Boolean(isActive)},
        updated_at         = NOW()
      WHERE id = ${id}
      RETURNING id, code, type, value, is_active, updated_at
    `;

    return ok(updated);
  } catch (error) {
    console.error('Update coupon error:', error);
    return err('Failed to update coupon', 500);
  }
}
