import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
          <Analytics />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
