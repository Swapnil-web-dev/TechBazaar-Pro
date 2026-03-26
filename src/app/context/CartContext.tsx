import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  quantity: number;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev: CartItem[]) => {
      const existing = prev.find((i: CartItem) => i.id === item.id);
      if (existing) {
        return prev.map((i: CartItem) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  };

  const updateQty = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev: CartItem[]) => prev.map((i: CartItem) => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id: number) => cartItems.some(i => i.id === id);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
