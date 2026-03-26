import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronLeft, Minus, Plus } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

// Shared product data — in a real app this would come from an API
const ALL_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3 Starter Kit', price: 1899, originalPrice: 2499, category: 'Arduino', vendor: 'TechWorld Electronics', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 45, badge: 'Bestseller', description: 'The perfect starter kit for learning electronics and embedded programming. Includes genuine Arduino Uno R3, breadboard, jumper wires, LEDs, resistors, and a comprehensive project booklet with 15 beginner projects.', specs: { Microcontroller: 'ATmega328P', 'Operating Voltage': '5V', 'Digital I/O Pins': '14', 'Analog Input Pins': '6', 'Flash Memory': '32 KB', 'Clock Speed': '16 MHz' } },
  { id: 2, name: 'Raspberry Pi 5 8GB', price: 8999, originalPrice: 9999, category: 'Single Board', vendor: 'Pi Store India', rating: 4.9, reviews: 189, image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 23, badge: 'New Arrival', description: 'The latest Raspberry Pi 5 with 8GB RAM. Ideal for AI projects, retro gaming, home server, and advanced computing applications.', specs: { Processor: 'Cortex-A76 2.4GHz', RAM: '8GB LPDDR4X', Storage: 'MicroSD', USB: '2x USB 3.0, 2x USB 2.0', Display: '2x HDMI 4K', Wireless: 'WiFi 5, BT 5.0' } },
  { id: 3, name: 'ESP32 WiFi + Bluetooth Module', price: 599, originalPrice: 799, category: 'IoT', vendor: 'IoT Hub', rating: 4.7, reviews: 456, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 67, badge: 'Hot Deal', description: 'Versatile dual-core ESP32 module with built-in WiFi and Bluetooth. Perfect for IoT projects, home automation, and wireless sensor networks.', specs: { CPU: 'Dual-Core Xtensa LX6', Frequency: '240 MHz', WiFi: '802.11 b/g/n', Bluetooth: 'BT 4.2 + BLE', Flash: '4MB', RAM: '520 KB' } },
  { id: 4, name: 'Robot Car Chassis Kit', price: 2499, originalPrice: 3499, category: 'Robotics', vendor: 'RoboShop', rating: 4.6, reviews: 345, image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 34, badge: 'Popular', description: 'Complete robot car chassis with 4 motors, wheels, motor driver, and all mounting hardware. Ready to assemble in 30 minutes.', specs: { Motors: '4x DC Gear Motors', 'Motor Driver': 'L298N', Chassis: 'Acrylic', Battery: '12V (not included)', Wheels: '65mm Diameter', Speed: 'Variable' } },
  { id: 5, name: 'Soldering Station 60W', price: 1299, originalPrice: 1799, category: 'Tools', vendor: 'ToolMart', rating: 4.5, reviews: 278, image: 'https://images.unsplash.com/photo-1562877773-a37120131ec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 56, badge: '', description: 'Professional temperature-controlled soldering station. Essential for PCB assembly, wire soldering, and component repair.', specs: { Power: '60W', Temperature: '200-480°C', 'Tip Type': 'T12 Compatible', Display: 'LED', 'Response Time': '< 2 seconds', Safety: 'Auto-off' } },
  { id: 6, name: 'Electronics Components Pack (500 pcs)', price: 899, originalPrice: 1299, category: 'Components', vendor: 'CompHub', rating: 4.8, reviews: 567, image: 'https://images.unsplash.com/photo-1759500657339-6e11b99a8882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 89, badge: 'Value Pack', description: 'Comprehensive components pack: resistors, capacitors, LEDs, transistors, diodes, and more. Everything you need for circuit experiments.', specs: { 'Total Pieces': '500+', Resistors: '200 pcs (20 values)', Capacitors: '100 pcs', LEDs: '50 pcs (5 colors)', Transistors: '50 pcs', Diodes: '50 pcs' } },
  { id: 7, name: 'Mechanical Keyboard RGB 60%', price: 3499, originalPrice: 4999, category: 'Accessories', vendor: 'KeyWorld', rating: 4.9, reviews: 423, image: 'https://images.unsplash.com/photo-1618586810102-aaa7049200c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 12, badge: 'Premium', description: 'Compact 60% mechanical keyboard with Cherry MX switches and per-key RGB lighting. Perfect for programmers and developers.', specs: { Layout: '60% (61 Keys)', Switches: 'Cherry MX Blue', Backlight: 'Per-key RGB', Interface: 'USB-C Detachable', 'Polling Rate': '1000 Hz', Compatibility: 'Win/Mac/Linux' } },
  { id: 8, name: 'Quadcopter Drone DIY Kit', price: 4999, originalPrice: 6999, category: 'Drones', vendor: 'SkyTech', rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1724406096705-f70c109e144d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 8, badge: 'Advanced', description: 'Complete FPV quadcopter kit. Includes frame, motors, ESCs, flight controller, and transmitter. Build and fly your own drone!', specs: { Frame: 'F450 Quad Frame', Motors: '1000KV Brushless x4', ESC: '30A x4', 'Flight Controller': 'APM 2.8', Battery: '3S 2200mAh (incl.)', 'Flight Time': '~12 min' } },
  { id: 9, name: '3D Printer Filament PLA 1kg', price: 1499, originalPrice: 1999, category: '3D Printing', vendor: 'PrintPro', rating: 4.6, reviews: 234, image: 'https://images.unsplash.com/photo-1703221561813-cdaa308cf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 45, badge: '', description: 'Premium PLA filament in 1kg spool. Perfect for beginners and experienced 3D printing enthusiasts.', specs: { Material: 'PLA', Diameter: '1.75mm', Weight: '1 kg', 'Print Temperature': '190-220°C', 'Bed Temperature': '0-60°C', Colors: '20+ Available' } },
  { id: 10, name: 'Breadboard + Jumper Wire Set', price: 299, originalPrice: 449, category: 'Components', vendor: 'WireWorld', rating: 4.4, reviews: 678, image: 'https://images.unsplash.com/photo-1649959188721-5ca7aeec6450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 123, badge: 'Starter Essential', description: '400-point breadboard with 65 jumper wires (M-M, M-F, F-F). Essential for prototyping circuits and experiments.', specs: { 'Breadboard Points': '400+', 'Jumper Wires': '65 pcs', Types: 'M-M, M-F, F-F', Lengths: '10cm, 15cm, 20cm', Material: 'Copper + PVC', 'Compatible With': 'All breadboard kits' } },
  { id: 11, name: 'Ultrasonic Sensor HC-SR04', price: 199, originalPrice: 299, category: 'Sensors', vendor: 'SensorMart', rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 234, badge: 'Most Popular', description: 'Classic HC-SR04 ultrasonic distance sensor. Measures distance 2cm-400cm with ±3mm accuracy.', specs: { Range: '2 - 400 cm', Accuracy: '±3 mm', Voltage: '5V DC', Current: '15 mA', Frequency: '40 kHz', 'Trigger Pulse': '10 µs TTL' } },
  { id: 12, name: 'LCD Display 16x2 with I2C Backpack', price: 349, originalPrice: 499, category: 'Displays', vendor: 'DisplayHub', rating: 4.5, reviews: 456, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', stock: 78, badge: '', description: 'Standard 16x2 character LCD with I2C backpack module. Uses only 2 Arduino pins (SDA/SCL). Blue backlight.', specs: { Characters: '16 x 2', Interface: 'I2C (4-pin)', Address: '0x27 (default)', 'Backlight Color': 'Blue', Voltage: '5V', Library: 'LiquidCrystal_I2C' } },
];

const REVIEWS = [
  { id: 1, name: 'Rahul Sharma', college: 'IIT Delhi, B.Tech CSE', rating: 5, date: 'Mar 15, 2026', text: 'Excellent quality! Used it for my final year project and it worked perfectly. Delivery was fast too.', avatar: 'RS' },
  { id: 2, name: 'Priya Patel', college: 'NIT Surat, ECE', rating: 5, date: 'Mar 10, 2026', text: 'Great product for the price. Components are genuine and tutorial included helped a lot.', avatar: 'PP' },
  { id: 3, name: 'Amit Kumar', college: 'BITS Pilani, EEE', rating: 4, date: 'Feb 25, 2026', text: 'Good product, exactly as described. Packaging could be better but everything arrived safe.', avatar: 'AK' },
];

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const productId = parseInt(id || '0');
  const product = ALL_PRODUCTS.find(p => p.id === productId);
  const related = ALL_PRODUCTS.filter(p => p.id !== productId && p.category === product?.category).slice(0, 3);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')} className="bg-purple-600 hover:bg-purple-700">Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, vendor: product.vendor, category: product.category });
    }
    toast.success(`${product.name} added to cart!`, { description: `Qty: ${qty}` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600">Products</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-white border shadow-sm mb-4">
              <ImageWithFallback src={product.image} alt={product.name} className="w-full h-[420px] object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden border-2 border-purple-200 hover:border-purple-500 cursor-pointer transition">
                  <ImageWithFallback src={img} alt={`view-${i}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {product.badge && <Badge className="bg-purple-600 text-white mb-3">{product.badge}</Badge>}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
              <span className="text-green-600 text-sm font-medium">• In Stock ({product.stock} left)</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <Badge className="bg-green-600 text-white">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-6">Sold by: <span className="font-semibold text-gray-800">{product.vendor}</span></p>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 transition rounded-l-lg">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 font-semibold text-lg border-x-2 border-gray-200">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-gray-100 transition rounded-r-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2">
                <ShoppingCart className="w-5 h-5" />
                {isInCart(product.id) ? 'Add More to Cart' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => { toggleWishlist(product.id); toast(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist!'); }}
                className={isWishlisted(product.id) ? 'border-red-300 text-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            <Button onClick={() => { handleAddToCart(); navigate('/checkout'); }} size="lg" variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 mb-6">
              Buy Now
            </Button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'On orders ₹500+' },
                { icon: Shield, label: 'Genuine Product', sub: 'Vendor verified' },
                { icon: RotateCcw, label: '7-Day Returns', sub: 'Easy returns' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-xl">
                  <b.icon className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="text-xs font-semibold">{b.label}</span>
                  <span className="text-xs text-gray-500">{b.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mb-16">
          <TabsList>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="specs">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-3 border-b last:border-0">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {REVIEWS.map(r => (
                <Card key={r.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                        {r.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-semibold">{r.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{r.college}</span>
                          </div>
                          <span className="text-xs text-gray-500">{r.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                        </div>
                        <p className="text-gray-600 text-sm">{r.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Shipping</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Free delivery on orders above ₹500</li>
                    <li>• Standard delivery: 3-5 business days via Shiprocket</li>
                    <li>• Express delivery available at checkout (1-2 days, ₹99 extra)</li>
                    <li>• Same-day delivery in Ahmedabad for select vendors</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Returns Policy</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• 7-day return policy for all products</li>
                    <li>• Product must be unused and in original packaging</li>
                    <li>• Defective/wrong items: Full refund + return shipping covered by vendor</li>
                    <li>• Refund processed within 5-7 business days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => (
                <Link to={`/products/${p.id}`} key={p.id}>
                  <Card className="hover:shadow-xl transition cursor-pointer overflow-hidden group">
                    <div className="h-48 overflow-hidden">
                      <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2">{p.name}</h3>
                      <span className="text-purple-600 font-bold">₹{p.price.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
