import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A22 — Coupon Usage Log
// GET /api/admin/coupons/:id/usages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const [coupon] = await sql`SELECT id, code FROM coupons WHERE id = ${id}`;
    if (!coupon) return err('Coupon not found', 404);

    const usages = await sql`
      SELECT
        cu.id,
        cu.discount_applied_paise,
        cu.used_at,
        o.order_number,
        u.email
      FROM coupon_usages cu
      JOIN orders o ON o.id = cu.order_id
      JOIN users  u ON u.id = cu.user_id
      WHERE cu.coupon_id = ${id}
      ORDER BY cu.used_at DESC
      LIMIT 100
    `;

    return ok({
      couponCode: coupon.code,
      usages: usages.map((u: Record<string, unknown>) => ({
        id:                   u.id,
        orderNumber:          u.order_number,
        customerEmail:        u.email,
        discountAppliedPaise: Number(u.discount_applied_paise),
        usedAt:               u.used_at,
      })),
    });
  } catch (error) {
    console.error('Coupon usages error:', error);
    return err('Failed to fetch coupon usages', 500);
  }
}
