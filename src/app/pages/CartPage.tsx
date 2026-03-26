import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const delivery = cartTotal >= 500 ? 0 : 49;
  const total = cartTotal + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/products">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Browse Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart <span className="text-gray-400 text-xl font-normal">({cartCount} items)</span></h1>
          <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
            <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/products/${item.id}`}>
                      <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link to={`/products/${item.id}`}>
                            <h3 className="font-semibold hover:text-purple-600 transition line-clamp-2">{item.name}</h3>
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">{item.vendor}</p>
                          {item.category && <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>}
                        </div>
                        <button
                          onClick={() => { removeFromCart(item.id); toast(`${item.name} removed`); }}
                          className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-100 transition rounded-l-lg">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1.5 font-medium text-sm border-x">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-100 transition rounded-r-lg">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600 text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                          {item.quantity > 1 && <p className="text-xs text-gray-400">₹{item.price.toLocaleString()} each</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <Link to="/products" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm mt-4">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    {delivery === 0
                      ? <span className="text-green-600 font-medium">FREE</span>
                      : <span>₹{delivery}</span>
                    }
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-gray-400">Add ₹{500 - cartTotal} more for free delivery</p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-purple-600">₹{total.toLocaleString()}</span>
                </div>

                {cartTotal >= 500 && (
                  <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    You qualify for free delivery! 🎉
                  </div>
                )}

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500 text-center">Secure checkout powered by Razorpay</p>
                  <div className="flex justify-center gap-2">
                    {['UPI', 'Card', 'COD', 'NetBanking'].map(m => (
                      <span key={m} className="text-xs bg-gray-100 px-2 py-1 rounded font-medium text-gray-600">{m}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
