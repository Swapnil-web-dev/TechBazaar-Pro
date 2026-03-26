import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

type PaymentMethod = 'upi' | 'card' | 'cod';

export function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '', email: '' });
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);

  const delivery = cartTotal >= 500 ? 0 : 49;
  const total = cartTotal + delivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    const missing = required.filter(k => !form[k as keyof typeof form]);
    if (missing.length > 0) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.phone.length !== 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API call
    clearCart();
    setLoading(false);
    navigate('/order-confirmation');
  };

  const payOptions: { id: PaymentMethod; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'upi', label: 'UPI / PhonePe / GPay', icon: Smartphone, desc: 'Instant payment via UPI apps' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay accepted' },
    { id: 'cod', label: 'Cash on Delivery', icon: Truck, desc: '₹20 extra charge for COD' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" placeholder="98765 43210" maxLength={10} value={form.phone} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="rahul@example.com" value={form.email} onChange={handleChange} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input id="address" name="address" placeholder="House No., Street, Area, Landmark" value={form.address} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" placeholder="Ahmedabad" value={form.city} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" placeholder="Gujarat" value={form.state} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" name="pincode" placeholder="380001" maxLength={6} value={form.pincode} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {payOptions.map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${payment === opt.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-purple-600 w-4 h-4" />
                      <opt.icon className={`w-5 h-5 ${payment === opt.id ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {payment === 'upi' && (
                  <div className="mt-4">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" placeholder="rahul@paytm" className="mt-1" />
                  </div>
                )}
                {payment === 'card' && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" maxLength={19} className="mt-1" />
                    </div>
                    <div>
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" maxLength={5} className="mt-1" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="•••" maxLength={3} type="password" className="mt-1" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                  {payment === 'cod' && <div className="flex justify-between"><span>COD Charges</span><span>₹20</span></div>}
                </div>
                <Separator className="mb-4" />
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-purple-600">₹{(total + (payment === 'cod' ? 20 : 0)).toLocaleString()}</span>
                </div>
                <Button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base">
                  {loading ? 'Placing Order...' : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Place Order</>
                  )}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secured by 256-bit SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
