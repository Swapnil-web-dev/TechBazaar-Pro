import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  ShoppingCart, 
  Store, 
  Package, 
  CheckCircle2,
  TrendingUp,
  Shield,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function HowItWorks() {
  const buyerSteps = [
    {
      step: '1',
      title: 'Browse Products',
      description: 'Explore 5000+ tech products across categories like Arduino, IoT, Robotics, and more',
      icon: ShoppingCart,
    },
    {
      step: '2',
      title: 'Choose & Compare',
      description: 'Compare prices from verified vendors, read reviews, and check product specifications',
      icon: Package,
    },
    {
      step: '3',
      title: 'Order with Confidence',
      description: 'Secure payment via Razorpay, get order tracking, and fast delivery across India',
      icon: CheckCircle2,
    },
    {
      step: '4',
      title: 'Learn & Build',
      description: 'Access free tutorials, code libraries, and community support for your projects',
      icon: GraduationCap,
    },
  ];

  const vendorSteps = [
    {
      step: '1',
      title: 'Register Your Store',
      description: 'Sign up in 5 minutes with basic business details. No hidden fees or complex paperwork',
      icon: Store,
    },
    {
      step: '2',
      title: 'List Your Products',
      description: 'Upload products with images, descriptions, and pricing. We provide SEO optimization',
      icon: Package,
    },
    {
      step: '3',
      title: 'Start Selling',
      description: 'Get orders from 12K+ students. We handle payment collection and provide analytics',
      icon: TrendingUp,
    },
    {
      step: '4',
      title: 'Grow Your Business',
      description: 'Get featured listings, marketing support, and access to bulk college orders',
      icon: Sparkles,
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Vendors Only',
      description: 'Every seller goes through quality verification. Authentic products guaranteed.',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: GraduationCap,
      title: 'Student-First Approach',
      description: 'Special pricing, project bundles, and learning resources designed for students.',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join 12K+ students in forums, WhatsApp groups, and get mentorship.',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      title: 'Fair Commission Model',
      description: 'Only 8-12% commission. New vendors get 3 months free to grow their business.',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter Vendor',
      price: 'Free',
      period: 'First 3 Months',
      description: 'Perfect for new sellers testing the market',
      features: [
        'Zero commission for 90 days',
        'List up to 20 products',
        'Basic analytics',
        'Email support',
        'Payment gateway integration',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Growth Vendor',
      price: '8%',
      period: 'Per Transaction',
      description: 'For established sellers scaling up',
      features: [
        '8% commission only',
        'Unlimited product listings',
        'Advanced analytics dashboard',
        'Featured product slots',
        'Priority support',
        'Marketing promotion',
      ],
      cta: 'Most Popular',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Bulk Orders',
      description: 'For manufacturers and distributors',
      features: [
        'Negotiable commission (6-8%)',
        'Dedicated account manager',
        'College partnership access',
        'Bulk order management',
        'API integration',
        'Custom solutions',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">How TechBazaar Pro Works</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            A transparent, student-first marketplace connecting tech enthusiasts with trusted vendors. 
            Simple for buyers, profitable for sellers.
          </p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">For Students & Developers</Badge>
          <h2 className="text-4xl font-bold mb-4">How to Buy on TechBazaar Pro</h2>
          <p className="text-gray-600 text-lg">Find everything you need for your next tech project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {buyerSteps.map((step) => (
            <div key={step.step} className="relative">
              <Card className="hover:shadow-xl transition h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
              {step.step !== '4' && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-600 w-8 h-8" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Start Shopping Now
          </Button>
        </div>
      </section>

      {/* For Vendors */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-600">For Vendors & Sellers</Badge>
            <h2 className="text-4xl font-bold mb-4">How to Sell on TechBazaar Pro</h2>
            <p className="text-gray-600 text-lg">Reach 12,000+ tech students and grow your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {vendorSteps.map((step) => (
              <div key={step.step} className="relative">
                <Card className="hover:shadow-xl transition h-full border-2 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {step.step !== '4' && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-600 w-8 h-8" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Register as Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose TechBazaar Pro?</h2>
          <p className="text-gray-600 text-lg">Built specifically for the tech student community in India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="hover:shadow-xl transition">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${benefit.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Transparent Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">Vendor Pricing Plans</h2>
            <p className="text-gray-600 text-lg">Choose the plan that fits your business goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`hover:shadow-2xl transition ${
                  plan.highlighted ? 'border-4 border-purple-600 transform scale-105' : ''
                }`}
              >
                <CardContent className="p-8">
                  {plan.highlighted && (
                    <Badge className="mb-4 bg-purple-600">Most Popular</Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-purple-600">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 text-lg mb-8">
          Join TechBazaar Pro today and be part of India's fastest-growing tech student community
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            I Want to Buy
          </Button>
          <Button size="lg" variant="outline">
            I Want to Sell
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
