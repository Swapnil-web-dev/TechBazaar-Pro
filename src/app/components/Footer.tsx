import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white leading-tight">TechBazaar</span>
                <span className="text-xs text-purple-400 leading-tight">Pro</span>
              </div>
            </div>
            <p className="text-sm mb-4">
              India's first niche marketplace for tech students, developers, and hobbyists. 
              Find everything for your next project.
            </p>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-purple-400 transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-purple-400 transition">Browse Products</Link></li>
              <li><Link to="/project-kits" className="hover:text-purple-400 transition">Project Kits</Link></li>
              <li><Link to="/learning-hub" className="hover:text-purple-400 transition">Learning Hub</Link></li>
              <li><Link to="/how-it-works" className="hover:text-purple-400 transition">How It Works</Link></li>
              <li><Link to="/vendor-dashboard" className="hover:text-purple-400 transition">Become a Vendor</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?cat=arduino" className="hover:text-purple-400 transition">Arduino & Boards</Link></li>
              <li><Link to="/products?cat=robotics" className="hover:text-purple-400 transition">Robotics Kits</Link></li>
              <li><Link to="/products?cat=iot" className="hover:text-purple-400 transition">IoT Devices</Link></li>
              <li><Link to="/products?cat=sensors" className="hover:text-purple-400 transition">Sensors & Modules</Link></li>
              <li><Link to="/products?cat=tools" className="hover:text-purple-400 transition">Dev Tools</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@techbazaarpro.in</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-400">Business Hours:</p>
              <p className="text-sm">Mon-Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          <p>&copy; 2026 TechBazaar Pro. All rights reserved. | Built for students, by tech enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
}
