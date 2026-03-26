import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Video, Code, Users, Play, Clock, Star } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function LearningHub() {
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Arduino',
      description: 'Learn the basics of Arduino programming and build your first LED blink project',
      duration: '45 min',
      level: 'Beginner',
      students: 2345,
      rating: 4.9,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzc0MzMwNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      title: 'IoT with ESP32: Complete Guide',
      description: 'Master IoT fundamentals and connect ESP32 to cloud platforms',
      duration: '2 hours',
      level: 'Intermediate',
      students: 1567,
      rating: 4.8,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBkZXZpY2VzJTIwc21hcnQlMjBob21lfGVufDF8fHx8MTc3NDQyMDExNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 3,
      title: 'Robotics: Line Following Robot',
      description: 'Build and program an autonomous line following robot from scratch',
      duration: '1.5 hours',
      level: 'Beginner',
      students: 1890,
      rating: 4.7,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGtpdCUyMHByb2plY3R8ZW58MXx8fHwxNzc0NDIwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 4,
      title: 'Raspberry Pi AI Projects',
      description: 'Implement computer vision and machine learning on Raspberry Pi',
      duration: '3 hours',
      level: 'Advanced',
      students: 789,
      rating: 4.9,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1631553127988-36343ac5bb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNwYmVycnklMjBwaSUyMGNvbXB1dGVyfGVufDF8fHx8MTc3NDQyMDExNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const codeSnippets = [
    {
      id: 1,
      title: 'Arduino LED Blink',
      language: 'C++',
      downloads: 2345,
      description: 'Basic LED blink code for Arduino',
    },
    {
      id: 2,
      title: 'ESP32 WiFi Connection',
      language: 'C++',
      downloads: 1890,
      description: 'Connect ESP32 to WiFi network',
    },
    {
      id: 3,
      title: 'DHT22 Sensor Reading',
      language: 'C++',
      downloads: 1567,
      description: 'Read temperature and humidity data',
    },
    {
      id: 4,
      title: 'Servo Motor Control',
      language: 'C++',
      downloads: 1234,
      description: 'Control servo motor position',
    },
  ];

  const projects = [
    {
      id: 1,
      title: 'Smart Dustbin using Arduino',
      author: 'Rahul Sharma',
      likes: 234,
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1553408226-42ecf81a214c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmR1aW5vJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzc0MzMwNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      title: 'Home Automation with ESP32',
      author: 'Priya Patel',
      likes: 567,
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpb3QlMjBkZXZpY2VzJTIwc21hcnQlMjBob21lfGVufDF8fHx8MTc3NDQyMDExNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 3,
      title: 'Gesture Controlled Robot',
      author: 'Amit Kumar',
      likes: 890,
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1743495851178-56ace672e545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGtpdCUyMHByb2plY3R8ZW58MXx8fHwxNzc0NDIwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow-400 text-gray-900 mb-4">
            Free Learning Resources
          </Badge>
          <h1 className="text-5xl font-bold mb-6">Learning Hub</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Master electronics, IoT, robotics, and programming with our comprehensive tutorials, 
            code libraries, and community projects — all completely free!
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>500+ Tutorials</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <span>1000+ Code Snippets</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>12K+ Students</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="tutorials" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="code">Code Library</TabsTrigger>
            <TabsTrigger value="projects">Community Projects</TabsTrigger>
            <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
          </TabsList>

          {/* Video Tutorials */}
          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-xl transition overflow-hidden">
                  <div className="relative h-56 overflow-hidden group">
                    <ImageWithFallback 
                      src={tutorial.image}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-purple-600 ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                      {tutorial.level}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{tutorial.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{tutorial.students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{tutorial.rating}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Code Library */}
          <TabsContent value="code">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {codeSnippets.map((snippet) => (
                <Card key={snippet.id} className="hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{snippet.title}</h3>
                        <p className="text-sm text-gray-600">{snippet.description}</p>
                      </div>
                      <Code className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <code className="text-sm text-green-400 font-mono">
                        {snippet.language === 'C++' && (
                          <>
                            void setup() {'{'}<br />
                            &nbsp;&nbsp;pinMode(LED_PIN, OUTPUT);<br />
                            {'}'}<br />
                            void loop() {'{'}<br />
                            &nbsp;&nbsp;digitalWrite(LED_PIN, HIGH);<br />
                            &nbsp;&nbsp;delay(1000);<br />
                            {'}'}
                          </>
                        )}
                      </code>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{snippet.language}</Badge>
                        <span className="text-sm text-gray-500">{snippet.downloads} downloads</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Browse Full Code Library
              </Button>
            </div>
          </TabsContent>

          {/* Community Projects */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-xl transition overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-purple-600 text-white">
                      {project.difficulty}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">by {project.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">❤️ {project.likes} likes</span>
                      <Button variant="outline" size="sm">
                        View Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Submit Your Project
              </Button>
            </div>
          </TabsContent>

          {/* Discussion Forum */}
          <TabsContent value="forum">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Connect with 12,000+ tech students and developers. Ask questions, share knowledge, 
                  and collaborate on projects. Get help from experienced mentors and vendors.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Join WhatsApp Community
                  </Button>
                  <Button size="lg" variant="outline">
                    Browse Forum
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">12K+</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2.5K+</div>
                    <div className="text-sm text-gray-600">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
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
