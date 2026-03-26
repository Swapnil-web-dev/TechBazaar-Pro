import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, Search, ChevronLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 illustration */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-black text-purple-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Looks like this component went missing — just like that ESP32 you ordered from the other marketplace. 😅
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2 px-6">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="gap-2 px-6">
              <ChevronLeft className="w-4 h-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
