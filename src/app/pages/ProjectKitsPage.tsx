import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle2, Star, Package, BookOpen, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const projectKits = [
  { id: 101, name: 'IoT Smart Home Automation Kit', price: 3499, originalPrice: 4999, category: 'Final Year Project', difficulty: 'Intermediate', duration: '2-3 weeks', rating: 4.9, reviews: 567, students: 1234, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['ESP32 Board', '5 Sensors', 'Relay Module', 'Mobile App Code', 'Documentation'], learning: ['IoT Fundamentals', 'MQTT Protocol', 'Mobile App Integration'] },
  { id: 102, name: 'Arduino Based Line Following Robot', price: 2499, originalPrice: 3499, category: 'Robotics', difficulty: 'Beginner', duration: '1-2 weeks', rating: 4.8, reviews: 789, students: 2345, image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['Arduino Uno', 'Motor Driver', 'IR Sensors', 'Chassis', 'Complete Code'], learning: ['Arduino Programming', 'Motor Control', 'Sensor Integration'] },
  { id: 103, name: 'Raspberry Pi AI Vision System', price: 8999, originalPrice: 11999, category: 'AI/ML', difficulty: 'Advanced', duration: '3-4 weeks', rating: 4.9, reviews: 345, students: 678, image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['Raspberry Pi 5', 'Pi Camera', 'AI Libraries', 'Display', 'Tutorial Videos'], learning: ['Computer Vision', 'TensorFlow', 'Object Detection'] },
  { id: 104, name: 'Gesture Controlled Drone Kit', price: 5999, originalPrice: 7999, category: 'Drone Tech', difficulty: 'Advanced', duration: '4-5 weeks', rating: 4.7, reviews: 234, students: 456, image: 'https://images.unsplash.com/photo-1724406096705-f70c109e144d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['Quadcopter Frame', 'Flight Controller', 'MPU6050', 'Battery', 'Transmitter'], learning: ['Drone Programming', 'Gesture Recognition', 'PID Control'] },
  { id: 105, name: 'Weather Monitoring Station', price: 1999, originalPrice: 2999, category: 'IoT', difficulty: 'Beginner', duration: '1 week', rating: 4.6, reviews: 456, students: 1890, image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['NodeMCU', 'DHT22', 'BMP180', 'Rain Sensor', 'Cloud Dashboard'], learning: ['Sensor Data', 'Cloud Integration', 'Data Visualization'] },
  { id: 106, name: 'Voice Controlled Home Assistant', price: 2799, originalPrice: 3999, category: 'AI/IoT', difficulty: 'Intermediate', duration: '2 weeks', rating: 4.8, reviews: 678, students: 1567, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['Raspberry Pi Zero', 'USB Mic', 'Speaker', 'Relay Board', 'AI Model'], learning: ['Speech Recognition', 'NLP Basics', 'Home Automation'] },
  { id: 107, name: 'Smart Agriculture IoT System', price: 4499, originalPrice: 6499, category: 'Final Year Project', difficulty: 'Intermediate', duration: '3-4 weeks', rating: 4.8, reviews: 312, students: 890, image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['ESP32', 'Soil Sensor', 'pH Sensor', 'Water Pump', 'GSM Module'], learning: ['Agricultural IoT', 'Sensor Calibration', 'Automation Systems'] },
  { id: 108, name: 'Autonomous Path Planning Robot', price: 6999, originalPrice: 9999, category: 'Robotics', difficulty: 'Advanced', duration: '5-6 weeks', rating: 4.7, reviews: 189, students: 345, image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', includes: ['ROS Compatible Robot', 'LIDAR Sensor', 'Raspberry Pi 5', 'Servo Motors', 'Code Base'], learning: ['ROS Framework', 'SLAM Algorithm', 'Navigation Stack'] },
];

type Kit = typeof projectKits[0];

function KitCard({ kit, onBuy }: { kit: Kit; onBuy: (k: Kit) => void }) {
  return (
    <Card className="hover:shadow-xl transition overflow-hidden flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback src={kit.image} alt={kit.name} className="w-full h-full object-cover" />
        <Badge className="absolute top-3 left-3 bg-purple-600 text-white">{kit.difficulty}</Badge>
        <Badge className="absolute top-3 right-3 bg-green-600 text-white">Save ₹{(kit.originalPrice - kit.price).toLocaleString()}</Badge>
      </div>
      <CardContent className="p-5 flex flex-col flex-1">
        <Badge variant="outline" className="mb-2 w-fit text-xs">{kit.category}</Badge>
        <h3 className="font-semibold text-base mb-2">{kit.name}</h3>
        <div className="flex items-center gap-2 mb-2 text-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{kit.rating}</span>
          <span className="text-gray-500">({kit.reviews}) • {kit.students.toLocaleString()} students</span>
        </div>
        <div className="mb-3">
          <p className="text-xs font-medium mb-1">Includes:</p>
          <div className="flex flex-wrap gap-1">
            {kit.includes.slice(0, 3).map((item, i) => <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>)}
            {kit.includes.length > 3 && <Badge variant="secondary" className="text-xs">+{kit.includes.length - 3} more</Badge>}
          </div>
        </div>
        <ul className="text-xs text-gray-600 space-y-1 mb-4">
          {kit.learning.slice(0, 2).map((l, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />{l}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-3 border-t flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-purple-600">₹{kit.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through ml-2">₹{kit.originalPrice.toLocaleString()}</span>
          </div>
        </div>
        <Button onClick={() => onBuy(kit)} className="w-full bg-purple-600 hover:bg-purple-700 mt-3">View Details &amp; Buy</Button>
      </CardContent>
    </Card>
  );
}

function KitGrid({ kits, onBuy }: { kits: Kit[]; onBuy: (k: Kit) => void }) {
  if (kits.length === 0) return <p className="text-center text-gray-400 py-12">No kits found in this category.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kits.map(k => <KitCard key={k.id} kit={k} onBuy={onBuy} />)}
    </div>
  );
}

export function ProjectKitsPage() {
  const { addToCart } = useCart();

  const handleBuy = (kit: Kit) => {
    addToCart({ id: kit.id, name: kit.name, price: kit.price, originalPrice: kit.originalPrice, image: kit.image, vendor: 'TechBazaar Pro', category: kit.category });
    toast.success(`${kit.name} added to cart! 🎉`);
  };

  const byDiff = (d: string) => projectKits.filter(k => k.difficulty === d);
  const finalYear = projectKits.filter(k => k.category.toLowerCase().includes('final'));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow-400 text-gray-900 mb-4">#1 Choice for Engineering Students</Badge>
          <h1 className="text-5xl font-bold mb-6">Ready-to-Build Project Kits</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Complete kits with all components, code, documentation, and learning support.
            Perfect for final year projects, internships, and hackathons.
          </p>
          <div className="flex justify-center gap-8 text-sm flex-wrap">
            {['3500+ Projects Completed', '95% Success Rate', 'Free Tech Support'].map(t => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /><span>{t}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package, title: 'Complete Components', desc: 'All hardware included' },
            { icon: BookOpen, title: 'Step-by-Step Guides', desc: 'Docs, videos & code' },
            { icon: Users, title: 'Community Support', desc: 'Join project groups' },
            { icon: CheckCircle2, title: 'Report Templates', desc: 'College-ready formats' },
          ].map(f => (
            <Card key={f.title} className="bg-white">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <f.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs defaultValue="all">
          <TabsList className="mb-8 flex-wrap gap-1">
            <TabsTrigger value="all">All ({projectKits.length})</TabsTrigger>
            <TabsTrigger value="beginner">Beginner ({byDiff('Beginner').length})</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate ({byDiff('Intermediate').length})</TabsTrigger>
            <TabsTrigger value="advanced">Advanced ({byDiff('Advanced').length})</TabsTrigger>
            <TabsTrigger value="final-year">Final Year ({finalYear.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all"><KitGrid kits={projectKits} onBuy={handleBuy} /></TabsContent>
          <TabsContent value="beginner"><KitGrid kits={byDiff('Beginner')} onBuy={handleBuy} /></TabsContent>
          <TabsContent value="intermediate"><KitGrid kits={byDiff('Intermediate')} onBuy={handleBuy} /></TabsContent>
          <TabsContent value="advanced"><KitGrid kits={byDiff('Advanced')} onBuy={handleBuy} /></TabsContent>
          <TabsContent value="final-year"><KitGrid kits={finalYear} onBuy={handleBuy} /></TabsContent>
        </Tabs>
      </section>

      <section className="bg-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Can't Find Your Project?</h2>
          <p className="text-lg mb-6 text-purple-100">We create custom project kits based on your requirements.</p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Request Custom Kit</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
