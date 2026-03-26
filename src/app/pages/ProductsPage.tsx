import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Star, Filter, ShoppingCart, Heart } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

const ALL_PRODUCTS = [
  { id: 1, name: 'Arduino Uno R3 Starter Kit', price: 1899, category: 'Arduino', vendor: 'TechWorld', rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 45 },
  { id: 2, name: 'Raspberry Pi 5 8GB', price: 8999, category: 'Single Board', vendor: 'Pi Store', rating: 4.9, reviews: 189, image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 23 },
  { id: 3, name: 'ESP32 WiFi + Bluetooth Module', price: 599, category: 'IoT', vendor: 'IoT Hub', rating: 4.7, reviews: 456, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 67 },
  { id: 4, name: 'Robot Car Chassis Kit', price: 2499, category: 'Robotics', vendor: 'RoboShop', rating: 4.6, reviews: 345, image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 34 },
  { id: 5, name: 'Soldering Station 60W', price: 1299, category: 'Tools', vendor: 'ToolMart', rating: 4.5, reviews: 278, image: 'https://images.unsplash.com/photo-1562877773-a37120131ec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 56 },
  { id: 6, name: 'Electronics Components Pack', price: 899, category: 'Components', vendor: 'CompHub', rating: 4.8, reviews: 567, image: 'https://images.unsplash.com/photo-1759500657339-6e11b99a8882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 89 },
  { id: 7, name: 'Mechanical Keyboard RGB 60%', price: 3499, category: 'Accessories', vendor: 'KeyWorld', rating: 4.9, reviews: 423, image: 'https://images.unsplash.com/photo-1618586810102-aaa7049200c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 12 },
  { id: 8, name: 'Quadcopter Drone DIY Kit', price: 4999, category: 'Drones', vendor: 'SkyTech', rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1724406096705-f70c109e144d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 8 },
  { id: 9, name: '3D Printer Filament PLA 1kg', price: 1499, category: '3D Printing', vendor: 'PrintPro', rating: 4.6, reviews: 234, image: 'https://images.unsplash.com/photo-1703221561813-cdaa308cf9e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 45 },
  { id: 10, name: 'Breadboard + Jumper Wire Set', price: 299, category: 'Components', vendor: 'WireWorld', rating: 4.4, reviews: 678, image: 'https://images.unsplash.com/photo-1649959188721-5ca7aeec6450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 123 },
  { id: 11, name: 'Ultrasonic Sensor HC-SR04', price: 199, category: 'Sensors', vendor: 'SensorMart', rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 234 },
  { id: 12, name: 'LCD Display 16x2 with I2C', price: 349, category: 'Displays', vendor: 'DisplayHub', rating: 4.5, reviews: 456, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', stock: 78 },
];

const CATEGORIES = ['Arduino', 'IoT', 'Robotics', 'Sensors', 'Components', 'Tools', 'Displays', 'Single Board', 'Drones', '3D Printing', 'Accessories'];

type SortKey = 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const urlCat = searchParams.get('cat') || '';
  const urlSearch = searchParams.get('search') || '';

  const [selectedCats, setSelectedCats] = useState<string[]>(urlCat ? [urlCat] : []);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('popular');
  const [visibleCount, setVisibleCount] = useState(12);

  const toggleCat = (cat: string) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (urlSearch) list = list.filter(p => p.name.toLowerCase().includes(urlSearch.toLowerCase()) || p.category.toLowerCase().includes(urlSearch.toLowerCase()));
    if (selectedCats.length > 0) list = list.filter(p => selectedCats.includes(p.category));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (inStockOnly) list = list.filter(p => p.stock > 0);
    switch (sort) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => b.id - a.id); break;
      default: list.sort((a, b) => b.reviews - a.reviews); break;
    }
    return list;
  }, [selectedCats, priceRange, minRating, inStockOnly, sort, urlSearch]);

  const handleAddToCart = (e: React.MouseEvent, p: typeof ALL_PRODUCTS[0]) => {
    e.preventDefault();
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, vendor: p.vendor, category: p.category });
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Products</h1>
          <p className="text-gray-600">
            {urlSearch ? `Search results for "${urlSearch}" — ` : ''}{filtered.length} verified tech products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5" />
                  <h2 className="font-semibold text-lg">Filters</h2>
                  {(selectedCats.length > 0 || minRating > 0 || inStockOnly) && (
                    <button onClick={() => { setSelectedCats([]); setMinRating(0); setInStockOnly(false); setPriceRange([0, 10000]); }}
                      className="ml-auto text-xs text-purple-600 hover:underline">Reset</button>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox id={cat} checked={selectedCats.includes(cat)} onCheckedChange={() => toggleCat(cat)} />
                        <label htmlFor={cat} className="text-sm cursor-pointer">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Min Rating</h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 0].map(r => (
                      <div key={r} className="flex items-center gap-2">
                        <Checkbox id={`r${r}`} checked={minRating === r} onCheckedChange={() => setMinRating(r)} />
                        <label htmlFor={`r${r}`} className="text-sm cursor-pointer flex items-center gap-1">
                          {r === 0 ? 'All ratings' : <><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {r}+</>}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock Only</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products</p>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-gray-500">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSelectedCats([]); setMinRating(0); setInStockOnly(false); setPriceRange([0, 10000]); }}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.slice(0, visibleCount).map(product => (
                    <Link to={`/products/${product.id}`} key={product.id}>
                      <Card className="hover:shadow-xl transition cursor-pointer overflow-hidden group h-full">
                        <div className="relative h-48 overflow-hidden">
                          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                          {product.stock < 20 && <Badge className="absolute top-3 left-3 bg-red-600 text-white">Only {product.stock} left</Badge>}
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); toast(isWishlisted(product.id) ? 'Removed from wishlist' : '❤️ Added to wishlist'); }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                          </button>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <Badge variant="outline" className="mb-2 text-xs w-fit">{product.category}</Badge>
                          <h3 className="font-semibold mb-1 line-clamp-2 flex-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {visibleCount < filtered.length && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" onClick={() => setVisibleCount(v => v + 6)}>
                      Load More ({filtered.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
