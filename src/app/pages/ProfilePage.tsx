import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Package, Settings, Shield, Edit3, CheckCircle2, Truck, Wrench } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product: string;
  customer: string;
  user_email?: string;
  amount: number;
  date: string;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export function ProfilePage() {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    avatar: user?.avatar || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`user_email.eq.${user.email},customer.eq.${user.name}`)
        .order('date', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
        setLoadingOrders(false);
        return;
      }
      // Silently fall through to local fallback on error or missing table
    }

    try {
      const allOrders: OrderItem[] = JSON.parse(localStorage.getItem('tb_all_orders') || '[]');
      const myOrders = allOrders.filter(o => o.user_email === user.email || o.customer === user.name);
      myOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(myOrders);
    } catch {
      setOrders([]);
    }
    setLoadingOrders(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleProfileUpdate = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and Email are required");
      return;
    }
    setSavingProfile(true);
    const success = await updateProfile({
      name: editForm.name,
      email: editForm.email,
      mobile: editForm.mobile,
      avatar: editForm.avatar
    });
    setSavingProfile(false);
    if (success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarUpdate = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
        toast.success("Avatar selected! Click 'Save Changes' to update.");
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and public profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden bg-cover bg-center" style={editForm.avatar ? { backgroundImage: `url(${editForm.avatar})` } : {}}>
              {!editForm.avatar && (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/gif" 
                onChange={handleFileChange} 
              />
              <Button variant="outline" size="sm" className="gap-2" onClick={handleAvatarUpdate}>
                <Edit3 className="w-4 h-4" /> Change Avatar
              </Button>
              <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="tel" value={editForm.mobile} onChange={e => setEditForm(p => ({ ...p, mobile: e.target.value }))} maxLength={10} placeholder="10-digit mobile number" />
            </div>
            <div className="space-y-2">
              <Label>Account Role</Label>
              <div>
                <Badge variant="outline" className={`capitalize ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'} mt-1`}>
                  {user.role} Account
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={user.joinDate || 'Recently'} disabled className="bg-gray-50 text-gray-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={handleProfileUpdate} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {loadingOrders ? (
          <div className="py-20 text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center text-gray-500">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
            <p>You haven't placed any orders. Start exploring our products!</p>
            <Button onClick={() => window.location.href = '/products'} className="mt-6" variant="outline">Browse Products</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y text-gray-500 text-sm">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-purple-600">{o.id}</td>
                    <td className="p-4 max-w-[200px] truncate" title={o.product}>
                      {o.product}
                    </td>
                    <td className="p-4 text-gray-500">{o.date}</td>
                    <td className="p-4 font-semibold text-gray-900">₹{o.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {o.status === 'Delivered' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {o.status === 'Shipped' && <Truck className="w-4 h-4 text-blue-500" />}
                        {(o.status === 'Processing' || o.status === 'Placed') && <Package className="w-4 h-4 text-yellow-500" />}
                        <Badge variant="outline" className={
                          o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          o.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          o.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }>
                          {o.status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderServicesTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Active Services & Subscriptions</CardTitle>
        <CardDescription>Manage your premium warranties and technical support packages.</CardDescription>
      </CardHeader>
      <CardContent className="py-10 text-center flex flex-col items-center">
        <Wrench className="w-16 h-16 text-purple-200 mb-6" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Services Bound</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          You currently don't have any extended warranties or premium support subscriptions active on your account. 
          When you purchase premium services, they will appear here.
        </p>
        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">Explore Services</Button>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your app preferences and notification settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
              <div>
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-500">Receive emails about your order status</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-purple-600 cursor-pointer" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
              <div>
                <p className="font-medium text-gray-900">Promotions & Offers</p>
                <p className="text-sm text-gray-500">Receive special deals and discounts</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-purple-600 cursor-pointer" />
            </label>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mt-8 mb-4">Danger Zone</h4>
          <div className="p-4 border border-red-200 bg-red-50 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700 mt-1 max-w-[80%]">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <Button variant="destructive" onClick={() => toast.error("Account deletion requires contacting support.")}>Delete Account</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Workspace</h1>
          <p className="text-gray-500 mt-2">Manage your account details and view your activities here.</p>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8 items-start">
          <TabsList className="flex flex-row md:flex-col w-full md:w-64 h-auto bg-transparent gap-2 p-0 rounded-none overflow-x-auto">
            <TabsTrigger value="profile" className="justify-start px-4 py-3 text-left w-full rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none transition-all">
              <User className="w-4 h-4 mr-3" /> Profile Details
            </TabsTrigger>
            <TabsTrigger value="orders" className="justify-start px-4 py-3 text-left w-full rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none transition-all">
              <Package className="w-4 h-4 mr-3" /> My Orders & History
            </TabsTrigger>
            <TabsTrigger value="services" className="justify-start px-4 py-3 text-left w-full rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none transition-all">
              <Shield className="w-4 h-4 mr-3" /> Active Services
            </TabsTrigger>
            <TabsTrigger value="settings" className="justify-start px-4 py-3 text-left w-full rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-none transition-all">
              <Settings className="w-4 h-4 mr-3" /> Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 w-full m-0 min-h-[500px]">
            <TabsContent value="profile" className="mt-0">{renderProfileTab()}</TabsContent>
            <TabsContent value="orders" className="mt-0">{renderOrdersTab()}</TabsContent>
            <TabsContent value="services" className="mt-0">{renderServicesTab()}</TabsContent>
            <TabsContent value="settings" className="mt-0">{renderSettingsTab()}</TabsContent>
          </div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
