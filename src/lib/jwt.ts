import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  is_banned?: boolean;
}

export interface RefreshPayload {
  userId: string;
  sessionId: string;
}

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
  return secret;
}

export const signAccessToken = (payload: JWTPayload): string =>
  jwt.sign(payload, getAccessSecret(), { expiresIn: '1h' });

export const signRefreshToken = (userId: string, sessionId: string): string =>
  jwt.sign({ userId, sessionId }, getRefreshSecret(), { expiresIn: '7d' });

export const verifyAccessToken = (token: string): JWTPayload =>
  jwt.verify(token, getAccessSecret()) as JWTPayload;

export const verifyRefreshToken = (token: string): RefreshPayload =>
  jwt.verify(token, getRefreshSecret()) as RefreshPayload;
