import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Store, Package, TrendingUp, DollarSign, Upload, Eye, Edit, Trash2, Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 35 },
  { name: 'Thu', sales: 2780, orders: 15 },
  { name: 'Fri', sales: 8900, orders: 50 },
  { name: 'Sat', sales: 12000, orders: 85 },
  { name: 'Sun', sales: 9500, orders: 60 },
];

export function VendorDashboard() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Arduino Uno R3', price: 1899, stock: 45, sales: 234, status: 'active', image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?w=200' },
    { id: 2, name: 'ESP32 Module', price: 599, stock: 67, sales: 456, status: 'active', image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?w=200' },
    { id: 3, name: 'Sensor Kit', price: 899, stock: 12, sales: 89, status: 'low-stock', image: 'https://images.unsplash.com/photo-1759500657339-6e11b99a8882?w=200' },
  ]);

  const stats = [
    { label: 'Total Sales', value: '₹45,670', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Products', value: products.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: '156', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Store Rating', value: '4.8★', icon: Store, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);

    if (!name || isNaN(price) || isNaN(stock)) {
      toast.error('Please fill in required valid fields.');
      return;
    }

    const newProd = {
      id: Date.now(),
      name,
      price,
      stock,
      sales: 0,
      status: stock > 20 ? 'active' : 'low-stock',
      image: 'https://images.unsplash.com/photo-1759500657339-6e11b99a8882?w=200' // mock image
    };
    
    setProducts([...products, newProd]);
    toast.success('Product added successfully!');
    e.currentTarget.reset();
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your products and grow your business</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Price: ₹{product.price.toLocaleString()}</span>
                            <span>Stock: {product.stock}</span>
                            <span>Sales: {product.sales}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.status === 'low-stock' ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge className="bg-green-600 border-none">Active</Badge>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center text-gray-500 py-6">No products found.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleAddProduct}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input name="name" id="name" placeholder="e.g., Arduino Uno R3 Starter Kit" required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input name="category" id="category" placeholder="e.g., Arduino & Boards" required />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input name="price" id="price" type="number" placeholder="1899" required />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input name="stock" id="stock" type="number" placeholder="50" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Product Description *</Label>
                    <Textarea 
                      name="description"
                      id="description" 
                      placeholder="Describe your product in detail..." 
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <Label>Product Images (Simulation)</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      Publish Product
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '#ORD-1234', customer: 'Rahul Sharma', product: 'Arduino Uno R3', amount: '₹1,899', status: 'Processing', date: 'Mar 25, 2026' },
                    { id: '#ORD-1233', customer: 'Priya Patel', product: 'ESP32 Module', amount: '₹599', status: 'Shipped', date: 'Mar 24, 2026' },
                    { id: '#ORD-1232', customer: 'Amit Kumar', product: 'Sensor Kit', amount: '₹899', status: 'Delivered', date: 'Mar 23, 2026' },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold mb-1">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer} • {order.product}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-semibold mb-2">{order.amount}</p>
                        <Badge 
                          className={`border-none ${
                            order.status === 'Delivered' ? 'bg-green-600 text-white' :
                            order.status === 'Shipped' ? 'bg-blue-600 text-white' :
                            'bg-yellow-600 text-white'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics (Weekly Overview)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full mt-4 text-xs lg:text-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#9333ea" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="orders" name="Orders Count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium mb-2">Settings Hub</p>
                  <p className="text-sm">Manage your business profile, payouts, and notification preferences.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
