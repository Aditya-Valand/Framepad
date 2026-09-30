import { ok, err, userId } from '@/lib/api';
import { sql } from '@/lib/db';
import crypto from 'crypto';

const CLOUD_NAME   = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY      = process.env.CLOUDINARY_API_KEY!;
const API_SECRET   = process.env.CLOUDINARY_API_SECRET!;

// ── Film strip dimensions ─────────────────────────────────────
const FRAME_W  = 600;
const FRAME_H  = 500;
const BORDER   = 16;
const GAP      = 12;
const LABEL_H  = 44;
const STRIP_W  = FRAME_W + BORDER * 2;
const STRIP_H  = (FRAME_H + GAP) * 4 - GAP + BORDER * 2 + LABEL_H;

async function renderStrip(shotUrls: string[]): Promise<Buffer> {
  const { createCanvas, loadImage } = await import('canvas');

  const canvas = createCanvas(STRIP_W, STRIP_H);
  const ctx = canvas.getContext('2d');

  // Black background
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  // Sprocket holes
  ctx.fillStyle = '#252525';
  for (let y = 0; y < STRIP_H; y += 30) {
    ctx.beginPath(); ctx.arc(8, y + 10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(STRIP_W - 8, y + 10, 5, 0, Math.PI * 2); ctx.fill();
  }

  // Draw 4 frames
  for (let i = 0; i < Math.min(shotUrls.length, 4); i++) {
    const y = BORDER + i * (FRAME_H + GAP);
    const x = BORDER;

    // White Polaroid border
    ctx.fillStyle = '#FFFCF8';
    ctx.fillRect(x - 3, y - 3, FRAME_W + 6, FRAME_H + 6);

    try {
      const img = await loadImage(shotUrls[i]);
      // Cover-fit
      const imgAspect   = img.width / img.height;
      const frameAspect = FRAME_W / FRAME_H;
      let sw = img.width, sh = img.height, sx = 0, sy = 0;
      if (imgAspect > frameAspect) { sw = img.height * frameAspect; sx = (img.width - sw) / 2; }
      else                          { sh = img.width / frameAspect;  sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, x, y, FRAME_W, FRAME_H);
    } catch {
      // Draw grey placeholder if image fails
      ctx.fillStyle = '#333';
      ctx.fillRect(x, y, FRAME_W, FRAME_H);
    }
  }

  // Date stamp
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font      = '600 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`polamuse · ${date}`, STRIP_W / 2, STRIP_H - LABEL_H / 2 + 4);

  return canvas.toBuffer('image/jpeg', { quality: 0.93 });
}

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder    = 'polamuse/booth';
  const toSign    = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha256').update(toSign).digest('hex');

  const form = new FormData();
  // Convert node Buffer → ArrayBuffer for Blob compatibility
  const ab = buffer.buffer instanceof SharedArrayBuffer
    ? new Uint8Array(buffer).buffer
    : (buffer.buffer as ArrayBuffer);
  form.append('file', new Blob([ab], { type: 'image/jpeg' }), 'strip.jpg');
  form.append('timestamp', timestamp);
  form.append('api_key',   API_KEY);
  form.append('signature', signature);
  form.append('folder',    folder);

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
  const data = await res.json() as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? 'Cloudinary upload failed');
  return data.secure_url;
}

// ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const uid = userId(req); // may be empty for guests

  let body: { shots?: unknown; layout?: string };
  try { body = await req.json(); } catch { return err('Invalid JSON', 400); }

  const { shots, layout = 'filmstrip' } = body;
  if (!Array.isArray(shots) || shots.length < 2 || shots.length > 4)
    return err('2–4 shot URLs required', 400);
  if (!shots.every((s): s is string => typeof s === 'string' && s.startsWith('http')))
    return err('Each shot must be a Cloudinary HTTPS URL', 400);
  if (!['filmstrip', 'grid', '2x2'].includes(layout))
    return err('Invalid layout', 400);

  try {
    const stripBuffer = await renderStrip(shots);
    const stripUrl    = await uploadToCloudinary(stripBuffer);

    // Save session (best-effort, don't fail the response if this errors)
    let sessionId: string | null = null;
    try {
      const [row] = await sql`
        INSERT INTO booth_sessions (user_id, shots, strip_url, layout)
        VALUES (
          ${uid || null},
          ${JSON.stringify(shots)},
          ${stripUrl},
          ${layout}
        ) RETURNING id`;
      sessionId = row.id;
    } catch {
      // Non-fatal — strip was rendered and uploaded
    }

    return ok({ stripUrl, sessionId });
  } catch (e) {
    console.error('[POST /api/booth/render]', e);
    return err('Failed to render strip', 500);
  }
}
