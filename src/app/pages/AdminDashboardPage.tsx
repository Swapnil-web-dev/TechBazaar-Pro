import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Shield, Users, Settings, LogOut, LayoutDashboard, ChevronRight, Package, CheckCircle, Truck, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// --- Data Types ---
type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem {
  id: string;
  product: string;
  customer: string;
  amount: number;
  date: string;
  status: OrderStatus;
}

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'orders' | 'settings'>('dashboard');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local');

  // ── localStorage refresh (fallback when Supabase not configured) ─────────────
  const refreshFromLocalStorage = useCallback(() => {
    try {
      const users = JSON.parse(localStorage.getItem('tb_all_users') || '[]');
      setRegisteredUsers(users);
      setLastRefreshed(new Date());
    } catch {
      setRegisteredUsers([]);
    }
  }, []);

  // ── Main data source: Supabase real-time OR localStorage fallback ─────────────
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // ✅ SUPABASE: Fetch all users + subscribe to real-time changes
      const sb = supabase; // non-null reference for use inside closures
      setDataSource('supabase');

      const fetchUsers = async () => {
        const { data, error } = await sb
          .from('users')
          .select('*')
          .order('join_date', { ascending: false });
        if (error) {
          console.error('[Supabase] Fetch error:', error.message);
          toast.error('Supabase error — check table name and RLS policies.');
        } else {
          const mapped = (data || []).map((row) => ({
            id:       row.id,
            name:     row.name,
            email:    row.email,
            role:     row.role,
            joinDate: row.join_date,
            status:   row.status,
          }));
          setRegisteredUsers(mapped);
          setLastRefreshed(new Date());
        }
      };

      // Expose to window for manual/interval refreshing
      (window as any).__refreshSupabaseUsers = fetchUsers;

      fetchUsers();

      // Real-time: listen for INSERT / UPDATE / DELETE on the users table
      const channel = sb
        .channel('admin-users-feed')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'users' },
          () => fetchUsers() // re-fetch on any change
        )
        .subscribe();

      // Fallback polling just in case Realtime isn't enabled in Supabase dashboard
      const interval = setInterval(fetchUsers, 5000);

      return () => { 
        sb.removeChannel(channel); 
        clearInterval(interval);
        delete (window as any).__refreshSupabaseUsers;
      };

    } else {
      // ⚠️ FALLBACK: localStorage (same browser only)
      setDataSource('local');
      refreshFromLocalStorage();

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'tb_all_users') refreshFromLocalStorage();
      };
      window.addEventListener('storage', handleStorageChange);
      const interval = setInterval(refreshFromLocalStorage, 5000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [refreshFromLocalStorage]);

  // Route protection — must come after all hooks
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) return;

    if (dataSource === 'supabase' && supabase) {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        console.error('[Supabase] Delete error:', error.message);
        toast.error('Failed to delete user.');
      } else {
        toast.success(`User ${userEmail} deleted successfully.`);
      }
    } else {
      // localStorage fallback
      try {
        const users = JSON.parse(localStorage.getItem('tb_all_users') || '[]');
        const updatedUsers = users.filter((u: any) => u.id !== userId);
        localStorage.setItem('tb_all_users', JSON.stringify(updatedUsers));
        refreshFromLocalStorage();
        toast.success(`User ${userEmail} deleted locally.`);
      } catch (e) {
        console.error('Failed to delete user locally', e);
        toast.error('Failed to delete user locally.');
      }
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'orders', icon: Package, label: 'Products & Orders' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  const renderDashboard = () => (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
          <p className="text-gray-500 mt-1">Here is what's happening with TechBazaar today.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Users', value: registeredUsers.length, desc: 'Total registered users', color: 'text-blue-600' },
          { label: 'Recent Orders', value: orders.length, desc: 'Recent active orders', color: 'text-indigo-600' },
          { label: 'Total Revenue', value: `₹${orders.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`, desc: 'Total revenue from orders', color: 'text-emerald-600' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-0 shadow-sm bg-white hover:shadow-md transition">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</h3>
              <p className="text-xs text-gray-400">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm bg-white min-h-[400px]">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-4 opacity-75" />
            <p>System operational. No recent alerts.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderUsers = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">View and manage registered students and vendors.</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {/* Data source badge */}
          {dataSource === 'supabase' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              <Wifi className="w-3 h-3" /> Live · Supabase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              <WifiOff className="w-3 h-3" /> Offline Mode · Check .env settings
            </span>
          )}
          <span className="text-xs text-gray-400">Updated: {lastRefreshed.toLocaleTimeString()}</span>
          
          <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 h-8 text-xs" onClick={() => {
            if (dataSource === 'supabase' && (window as any).__refreshSupabaseUsers) {
              (window as any).__refreshSupabaseUsers();
            } else {
              refreshFromLocalStorage();
            }
            toast.success('List Refreshed!');
          }}>
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh
          </Button>

          {dataSource === 'local' && (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs" onClick={() => {
              localStorage.removeItem('tb_all_users');
              setRegisteredUsers([]);
              toast.success('Local cache cleared');
            }}>Clear Local</Button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b text-gray-500 text-sm">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Join Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {registeredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No registered users found.
                  </td>
                </tr>
              ) : registeredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${u.role === 'vendor' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-500">{u.joinDate || '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => setSelectedUser(u)} className="text-emerald-600 font-medium hover:underline mr-4">Show</button>
                    <button className="text-indigo-600 font-medium hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDeleteUser(u.id, u.email)} className="text-red-600 font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white shadow-xl relative border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <CardTitle className="text-xl">User Details</CardTitle>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">✕</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-6 text-sm">
                <div className="flex border-b pb-3"><span className="text-gray-500 w-28 font-medium">ID:</span> <span className="font-mono text-gray-900">{selectedUser.id}</span></div>
                <div className="flex border-b pb-3"><span className="text-gray-500 w-28 font-medium">Name:</span> <span className="font-bold text-gray-900">{selectedUser.name}</span></div>
                <div className="flex border-b pb-3"><span className="text-gray-500 w-28 font-medium">Email:</span> <span className="font-medium text-gray-900">{selectedUser.email}</span></div>
                <div className="flex border-b pb-3"><span className="text-gray-500 w-28 font-medium">Role:</span> <span className="capitalize text-gray-900">{selectedUser.role}</span></div>
                <div className="flex border-b pb-3"><span className="text-gray-500 w-28 font-medium">Join Date:</span> <span className="text-gray-900">{selectedUser.joinDate || '-'}</span></div>
                <div className="flex pb-2"><span className="text-gray-500 w-28 font-medium">Status:</span> <span className="text-gray-900">{selectedUser.status || 'Active'}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const renderOrders = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders & Products</h1>
          <p className="text-gray-500 mt-1">Track customer orders and manage fulfillment statuses.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b text-gray-500 text-sm">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{o.id}</td>
                  <td className="p-4">
                    <div className="text-gray-900 font-medium">{o.product}</div>
                    <div className="text-xs text-gray-500">{o.date}</div>
                  </td>
                  <td className="p-4 text-gray-600">{o.customer}</td>
                  <td className="p-4 font-semibold text-emerald-600">₹{o.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge className={
                      o.status === 'Delivered' ? 'bg-emerald-500 hover:bg-emerald-600' :
                        o.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-600' :
                          o.status === 'Processing' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                            'bg-gray-500 hover:bg-gray-600'
                    }>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {o.status !== 'Delivered' && (
                      <div className="flex items-center gap-2">
                        {o.status === 'Placed' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs border-yellow-200 text-yellow-700 hover:bg-yellow-50" onClick={() => updateOrderStatus(o.id, 'Processing')}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Process
                          </Button>
                        )}
                        {o.status === 'Processing' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => updateOrderStatus(o.id, 'Shipped')}>
                            <Truck className="w-3 h-3 mr-1" /> Ship
                          </Button>
                        )}
                        {o.status === 'Shipped' && (
                          <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => updateOrderStatus(o.id, 'Delivered')}>
                            <CheckCircle className="w-3 h-3 mr-1" /> Deliver
                          </Button>
                        )}
                      </div>
                    )}
                    {o.status === 'Delivered' && (
                      <span className="text-xs text-gray-400 font-medium italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold">TechBazaar <span className="text-indigo-400">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">System Administrator</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
            <LogOut className="w-4 h-4 mr-2" />
            Logout Securely
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'settings' && (
            <div className="text-center py-20 text-gray-400">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">Platform Settings</p>
              <p className="mt-2">Settings module is currently under construction.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
