import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('tb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (id: number) => setWishlist((prev: number[]) => prev.includes(id) ? prev : [...prev, id]);
  const removeFromWishlist = (id: number) => setWishlist((prev: number[]) => prev.filter((i: number) => i !== id));
  const toggleWishlist = (id: number) => wishlist.includes(id) ? removeFromWishlist(id) : addToWishlist(id);
  const isWishlisted = (id: number) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
