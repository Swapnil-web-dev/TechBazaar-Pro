import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Cpu, Eye, EyeOff, User, Mail, Lock, GraduationCap, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { isSupabaseConfigured } from '../../lib/supabase';

type Role = 'student' | 'vendor';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [role, setRole] = useState<Role>('student');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    const ok = await register(form.name, form.email, form.password, role);
    setLoading(false);
    if (ok) {
      toast.success('Account created successfully! 🎉');
      navigate(role === 'vendor' ? '/vendor-dashboard' : '/products');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">TechBazaar <span className="text-purple-600">Pro</span></span>
        </Link>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
            <p className="text-gray-500 text-center text-sm mb-6">Join 12,000+ tech students and vendors</p>

            {!isSupabaseConfigured && (
              <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                <strong>Offline Mode Active:</strong> You are currently registering locally. Restart your Vite dev server to load Supabase, otherwise this account won't appear in the Admin Panel.
              </div>
            )}

            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
              {([['student', GraduationCap, 'Student'], ['vendor', Store, 'Vendor']] as const).map(([r, Icon, label]) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${role === r ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="name" name="name" placeholder="Rahul Sharma" className="pl-10" value={form.name} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="rahul@example.com" className="pl-10" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="password" name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className="pl-10 pr-10" value={form.password} onChange={handleChange} />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="confirm" name="confirm" type="password" placeholder="Re-enter password" className="pl-10" value={form.confirm} onChange={handleChange} />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 h-11 mt-2">
                {loading ? 'Creating account...' : `Create ${role === 'vendor' ? 'Vendor' : 'Student'} Account`}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
