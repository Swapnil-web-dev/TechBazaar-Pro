import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Shield, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Please fill all fields'); return; }
    
    setLoading(true);
    // Hardcoded check for admin
    if (username.toLowerCase() === 'swapnil' && password === 'swap@1522') {
      const ok = await login(username, password);
      setLoading(false);
      if (ok) {
        toast.success('Welcome back, Admin Swapnil! 🛡️');
        navigate('/admin/dashboard');
      }
    } else {
      setLoading(false);
      toast.error('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            TechBazaar <span className="text-indigo-400">Admin</span>
          </span>
        </Link>

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-white/10">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-center text-white mb-1">Admin Portal</h1>
            <p className="text-gray-400 text-center text-sm mb-8">Sign in to manage the platform</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <div className="relative mt-1 text-gray-900">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Admin Username" 
                    className="pl-10 bg-white/90 border-transparent focus:ring-indigo-500" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative mt-1 text-gray-900">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="pl-10 pr-10 bg-white/90 border-transparent focus:ring-indigo-500"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 mt-6 border-0 shadow-lg shadow-indigo-500/30">
                {loading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-gray-500 text-xs font-mono">
          <p>Restricted Access - TechBazaar Systems</p>
        </div>
      </div>
    </div>
  );
}
