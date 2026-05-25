import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

/**
 * Generate a SHA-256 signature for Cloudinary signed uploads.
 * Only called server-side (API routes).
 */
export function signUploadParams(params: Record<string, string>) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  const signature = crypto
    .createHash('sha256')
    .update(sortedParams + API_SECRET)
    .digest('hex');

  return {
    signature,
    timestamp: params.timestamp,
    apiKey: API_KEY,
    cloudName: CLOUD_NAME,
  };
}

export { CLOUD_NAME, API_KEY };

/**
 * Delete an asset from Cloudinary by public_id (server-side only).
 */
export async function deleteAsset(publicId: string): Promise<boolean> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha256').update(toSign).digest('hex');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_id: publicId,
        signature,
        api_key: API_KEY,
        timestamp,
      }),
    }
  );
  return res.ok;
}
