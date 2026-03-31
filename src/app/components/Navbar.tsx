import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingCart, User, Search, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/project-kits', label: 'Project Kits' },
    { to: '/learning-hub', label: 'Learning Hub' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">TechBazaar</span>
              <span className="text-xs text-purple-600 leading-tight">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-sm hover:text-purple-600 transition ${isActive(l.to) ? 'text-purple-600 font-semibold' : 'text-gray-700'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 h-9 text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth / User menu */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div 
                    className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center bg-cover bg-center overflow-hidden"
                    style={user?.avatar ? { backgroundImage: `url(${user?.avatar})` } : {}}
                  >
                    {!user?.avatar && <span className="text-purple-700 text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role} account</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4 text-gray-500" /> My Profile
                    </Link>
                    {user?.role === 'vendor' && (
                      <Link to="/vendor-dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4 text-gray-500" /> Vendor Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition w-full text-left text-red-600">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" /> Login
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} className={`py-2 px-2 rounded-lg text-sm ${isActive(l.to) ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {l.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="py-2 px-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="py-2 px-2 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4" /> Logout ({user?.name?.split(' ')[0]})
                  </button>
                </>
              ) : (
                <Link to="/login" className="py-2 px-2 text-purple-600 font-medium text-sm">Login / Register</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
