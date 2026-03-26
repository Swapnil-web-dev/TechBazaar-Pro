import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Cpu, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  GraduationCap,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function HomePage() {
  const { addToCart } = useCart();
  
  const categories = [
    { name: 'Arduino & Boards', icon: Cpu, count: '250+ Products', image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzc0MzMwNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Robotics Kits', icon: Zap, count: '120+ Kits', image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGtpdCUyMHByb2plY3R8ZW58MXx8fHwxNzc0NDIwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'IoT Devices', icon: Shield, count: '180+ Items', image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBkZXZpY2VzJTIwc21hcnQlMjBob21lfGVufDF8fHx8MTc3NDQyMDExNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Developer Tools', icon: Users, count: '300+ Tools', image: 'https://images.unsplash.com/photo-1618586810102-aaa7049200c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzc0NDIwMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  const featuredProducts = [
    { 
      id: 1,
      name: 'Arduino Uno R3 Starter Kit', 
      price: 1899,
      originalPrice: 2499,
      category: 'Arduino',
      vendor: 'TechWorld Electronics',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzc0MzMwNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      badge: 'Bestseller'
    },
    { 
      id: 2,
      name: 'Raspberry Pi 5 8GB', 
      price: 8999, 
      originalPrice: 9999,
      category: 'Single Board',
      vendor: 'Pi Store India',
      rating: 4.9,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyfGVufDF8fHx8MTc3NDQyMDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      badge: 'New Arrival'
    },
    { 
      id: 3,
      name: 'ESP32 Development Kit', 
      price: 599, 
      originalPrice: 799,
      category: 'IoT',
      vendor: 'IoT Hub',
      rating: 4.7,
      reviews: 456,
      image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBkZXZpY2VzJTIwc21hcnQlMjBob21lfGVufDF8fHx8MTc3NDQyMDExNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      badge: 'Hot Deal'
    },
    { 
      id: 4,
      name: 'Final Year IoT Project Kit', 
      price: 3499, 
      originalPrice: 4999,
      category: 'Final Year Project',
      vendor: 'Project Central',
      rating: 4.9,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1649959188721-5ca7aeec6450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhZGJvYXJkJTIwZWxlY3Ryb25pY3MlMjBwcm90b3R5cGV8ZW58MXx8fHwxNzc0NDIwMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      badge: 'Student Choice'
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, vendor: product.vendor, category: product.category });
    toast.success(`${product.name} added to cart!`);
  };

  const usps = [
    {
      icon: Shield,
      title: 'Verified Vendors',
      description: 'All sellers are verified with quality guarantees and authentic products'
    },
    {
      icon: GraduationCap,
      title: 'Learning Integration',
      description: 'Free tutorials, project guides, and community support with every purchase'
    },
    {
      icon: ShoppingBag,
      title: 'Project Bundles',
      description: 'Complete kits curated for final year projects, internships, and hackathons'
    },
    {
      icon: TrendingUp,
      title: 'Student Pricing',
      description: 'Exclusive discounts for students with bulk order benefits for colleges'
    },
  ];

  const stats = [
    { label: 'Verified Vendors', value: '150+' },
    { label: 'Products Listed', value: '5000+' },
    { label: 'Happy Students', value: '12K+' },
    { label: 'Projects Completed', value: '3500+' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-yellow-400 text-gray-900 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                India's First Tech Student Marketplace
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Build Your Next Project with TechBazaar Pro
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                From Arduino to IoT, Robotics to AI kits — everything tech students and developers need. 
                All in one curated marketplace with learning support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    Explore Products
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/project-kits">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Project Kits
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-purple-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1758685848208-e108b6af94cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjB0ZWNobm9sb2d5JTIwbGFifGVufDF8fHx8MTc3NDQyMDExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Students working on tech projects"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-bold">Fast Delivery</div>
                    <div className="text-sm text-gray-600">Across India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 text-lg">Find exactly what you need for your project</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/products?cat=${category.name.split(' ')[0]}`} key={category.name}>
              <Card className="hover:shadow-xl transition cursor-pointer overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked by our experts for students</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link to={`/products/${product.id}`} key={product.name}>
                <Card className="hover:shadow-xl transition cursor-pointer overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                    {product.badge}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.vendor}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Link>
            ))}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why TechBazaar Pro?</h2>
          <p className="text-gray-600 text-lg">Built specifically for the tech student community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp) => (
            <div key={usp.title} className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <usp.icon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{usp.title}</h3>
              <p className="text-gray-600 text-sm">{usp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students and developers building amazing things with TechBazaar Pro
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Shopping
              </Button>
            </Link>
            <Link to="/vendor-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Become a Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
