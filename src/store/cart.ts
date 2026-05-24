import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  designId: string;
  addedAt: number; // timestamp
}

interface CartStore {
  items: CartItem[];
  addItem: (designId: string) => void;
  removeItem: (designId: string) => void;
  setItems: (designIds: string[]) => void;
  clearCart: () => void;
  hasItem: (designId: string) => boolean;
  getDesignIds: () => string[];
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (designId) => {
        const { items } = get();
        if (items.some(i => i.designId === designId)) return;
        set({ items: [...items, { designId, addedAt: Date.now() }] });
      },

      removeItem: (designId) => {
        set({ items: get().items.filter(i => i.designId !== designId) });
      },

      setItems: (designIds) => {
        const now = Date.now();
        set({ items: designIds.map(designId => ({ designId, addedAt: now })) });
      },

      clearCart: () => set({ items: [] }),

      hasItem: (designId) => get().items.some(i => i.designId === designId),

      getDesignIds: () => get().items.map(i => i.designId),
    }),
    {
      name: 'polamuse-cart',
    }
  )
);
