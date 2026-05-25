import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { signUploadParams } from '@/lib/cloudinary';
import { NextRequest } from 'next/server';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;

/**
 * POST /api/designs/[id]/export
 * Accepts a base64 PNG of the rendered design, uploads to Cloudinary
 * with a stable public_id (overwrites on re-upload), and stores the URL.
 *
 * Body: { dataUrl: string } — the full data:image/png;base64,... string
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id: designId } = await params;
  const body = await req.json();
  const { dataUrl } = body;

  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return err('Invalid image data', 400);
  }

  // Verify the design belongs to this user
  const [design] = await sql`
    SELECT id FROM designs
    WHERE id = ${designId} AND user_id = ${uid} AND deleted_at IS NULL`;

  if (!design) return err('Design not found', 404);

  // Stable public_id — same design always overwrites the same asset
  const publicId = `polamuse/exports/${designId}`;

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign: Record<string, string> = {
      folder: 'polamuse/exports',
      public_id: publicId,
      timestamp,
      overwrite: 'true',
      invalidate: 'true',
    };

    const signed = signUploadParams(paramsToSign);

    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('public_id', publicId);
    formData.append('overwrite', 'true');
    formData.append('invalidate', 'true');
    formData.append('signature', signed.signature);
    formData.append('timestamp', signed.timestamp);
    formData.append('api_key', signed.apiKey);
    formData.append('folder', 'polamuse/exports');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text();
      console.error('Cloudinary upload failed:', errBody);
      return err('Upload failed', 500);
    }

    const result = await uploadRes.json();
    const exportUrl = result.secure_url;

    // Update designs table with the export URL
    await sql`
      UPDATE designs SET
        export_url = ${exportUrl},
        updated_at = NOW()
      WHERE id = ${designId}`;

    return ok({ exportUrl, publicId });
  } catch (error) {
    console.error('Export upload error:', error);
    return err('Failed to upload export', 500);
  }
}
