import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Cart } from '@/types';

interface CartState extends Cart {
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      total: 0,
      itemCount: 0,

      // Actions
      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        let newItems: CartItem[];
        
        if (existingItem) {
          // Update existing item quantity
          newItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };
          newItems = [...items, newItem];
        }
        
        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.product.id !== productId);
        
        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const { items } = get();
        const newItems = items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        
        set({
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      getItemQuantity: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    }
  )
);