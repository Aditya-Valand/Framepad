'use client';
import { useState, useEffect, useCallback } from 'react';

export function useUnlockStatus(designId: string | null) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/designs/${id}/download`);
      if (res.ok) {
        const data = await res.json();
        setIsUnlocked(!!data.is_unlocked);
      } else {
        setIsUnlocked(false);
      }
    } catch {
      setIsUnlocked(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!designId) { setIsUnlocked(null); return; }
    check(designId);
  }, [designId, check]);

  const refetch = useCallback(() => {
    if (designId) check(designId);
  }, [designId, check]);

  return { isUnlocked, loading, refetch };
}
