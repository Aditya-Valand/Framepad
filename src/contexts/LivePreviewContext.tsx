'use client';
import { createContext, useContext, useRef } from 'react';
import type { FilterValues } from '@/store';

export type LiveFilterHandle = {
  show: (filters: FilterValues) => void;
  hide: () => void;
};

const Ctx = createContext<React.MutableRefObject<LiveFilterHandle | null>>(null!);

export function useLivePreview() {
  return useContext(Ctx);
}

export function LivePreviewProvider({ children }: { children: React.ReactNode }) {
  const handleRef = useRef<LiveFilterHandle | null>(null);
  return <Ctx.Provider value={handleRef}>{children}</Ctx.Provider>;
}
