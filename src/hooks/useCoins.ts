'use client';
import { useState, useEffect, useCallback } from 'react';

export function useCoins() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/coins/balance');
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch {
      // Silently ignore — user may not be logged in
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  return { balance, loading, refresh: fetchBalance };
}
