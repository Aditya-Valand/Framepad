import { NextResponse } from 'next/server';

export const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const err = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export const userId = (req: Request): string =>
  req.headers.get('x-user-id') ?? '';

export const userRole = (req: Request): string =>
  req.headers.get('x-user-role') ?? '';

export const userEmail = (req: Request): string =>
  req.headers.get('x-user-email') ?? '';
