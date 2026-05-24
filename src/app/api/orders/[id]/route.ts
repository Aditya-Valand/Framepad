import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);
  const { id } = await params;

  const [order] = await sql`
    SELECT o.*, a.full_name as addr_name, a.phone as addr_phone,
           a.line1 as addr_line1, a.line2 as addr_line2, a.city as addr_city,
           a.state as addr_state, a.pincode as addr_pincode
    FROM orders o
    LEFT JOIN addresses a ON a.id = o.shipping_address_id
    WHERE o.id = ${id} AND o.user_id = ${uid}`;

  if (!order) return err('Order not found', 404);

  const items = await sql`
    SELECT oi.*, d.title as design_title, d.thumbnail_url,
           pt.name as product_type_name, pt.slug as product_type_slug,
           pf.name as finish_name, ps.name as size_name
    FROM order_items oi
    JOIN designs d ON d.id = oi.design_id
    JOIN product_types pt ON pt.id = oi.product_type_id
    JOIN print_finishes pf ON pf.id = oi.print_finish_id
    JOIN print_sizes ps ON ps.id = oi.print_size_id
    WHERE oi.order_id = ${id}`;

  const [payment] = await sql`
    SELECT provider_payment_id, amount_paise, status, payment_method, created_at
    FROM payments WHERE order_id = ${id} ORDER BY created_at DESC LIMIT 1`;

  const [shipment] = await sql`
    SELECT tracking_number, carrier, tracking_url, status, shipped_at, expected_delivery_at
    FROM shipments WHERE order_id = ${id} ORDER BY created_at DESC LIMIT 1`;

  return ok({ order, items, payment: payment || null, shipment: shipment || null });
}
