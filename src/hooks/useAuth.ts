'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
}

async function fetchMe(): Promise<AuthUser | null> {
  const r = await fetch('/api/auth/me', { credentials: 'include' });
  if (r.ok) return r.json();
  if (r.status !== 401) return null;

  // Access token expired — try silent refresh
  const refresh = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!refresh.ok) return null;

  // Retry with new access token
  const retry = await fetch('/api/auth/me', { credentials: 'include' });
  return retry.ok ? retry.json() : null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    window.location.href = '/';
  }, []);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return { user, loading, logout, initials };
}
