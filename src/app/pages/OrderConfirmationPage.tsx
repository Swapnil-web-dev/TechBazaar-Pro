import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

// Simple confetti from canvas-confetti
function launchConfetti() {
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#7c3aed', '#3b82f6', '#f59e0b', '#10b981'] });
  });
}

function generateOrderId() {
  return 'TBP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function OrderConfirmationPage() {
  const orderId = generateOrderId();
  const navigate = useNavigate();

  useEffect(() => {
    launchConfetti();
    const t = setTimeout(() => launchConfetti(), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-10 text-center">
            {/* Animated checkmark */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-green-500" style={{ animation: 'bounceIn 0.5s ease' }} />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-300 opacity-30 animate-ping" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
            <p className="text-gray-500 mb-6">Thank you for shopping with TechBazaar Pro. Your order is confirmed!</p>

            <div className="bg-purple-50 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Order ID</span>
                <span className="font-bold text-purple-700">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Expected Delivery</span>
                <span className="font-semibold text-green-600 text-sm">{getDeliveryDate()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Order Status</span>
                <span className="font-semibold text-blue-600 text-sm flex items-center gap-1"><Package className="w-3 h-3" /> Confirmed</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-8">
              You'll receive an SMS and email confirmation shortly. Track your order using the Order ID above.
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/products')} className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full">Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Contact us at support@techbazaarpro.in or call +91 98765 43210
        </p>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
