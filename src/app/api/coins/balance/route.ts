import { ok, err, userId } from '@/lib/api';
import { getBalance } from '@/lib/coins';

export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const balance = await getBalance(uid);
  return ok({ balance });
}
