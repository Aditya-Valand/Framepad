import { signUploadParams } from '@/lib/cloudinary';
import { userId, err } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const folder = body.folder || 'polamuse/uploads';

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = { folder, timestamp };

  const signed = signUploadParams(params);

  return NextResponse.json({
    signature: signed.signature,
    timestamp: signed.timestamp,
    apiKey: signed.apiKey,
    cloudName: signed.cloudName,
    uploadUrl: `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
  });
}
