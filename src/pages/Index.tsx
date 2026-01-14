import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Syringe,
  Shield,
  ArrowRight,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Video,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  Building2,
  TestTube,
  Clock,
  Moon,
  Sun,
  Menu,
  X,
  Newspaper,
  Globe,
  Award,
  HeartPulse,
  Stethoscope,
  Activity,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { dashboardStats, cities, demoHospitals } from '@/lib/demoData';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const { vaccines, news } = useAppointments();
  const navigate = useNavigate();

  // Form state for scheduling
  const [scheduleForm, setScheduleForm] = useState({
    location: '',
    date: '',
    vaccineType: ''
  });

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  // Handle schedule form submit
  const handleScheduleSubmit = () => {
    if (!scheduleForm.location || !scheduleForm.date || !scheduleForm.vaccineType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to schedule your vaccination.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to patient register or book appointment with prefilled data
    if (isAuthenticated && role === 'patient') {
      navigate('/patient/book-appointment', {
        state: {
          city: scheduleForm.location,
          date: scheduleForm.date,
          vaccineId: scheduleForm.vaccineType
        }
      });
    } else {
      navigate('/patient/register', {
        state: {
          city: scheduleForm.location,
          date: scheduleForm.date,
          vaccineId: scheduleForm.vaccineType
        }
      });
    }
  };

  // Contact handlers
  const handleCall = () => {
    window.location.href = 'tel:1800-123-4567';
  };

  const handleChat = () => {
    toast({
      title: "Live Chat",
      description: "Our support team will connect with you shortly!"
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Consultation",
      description: "Video call feature coming soon! Please use phone support for now."
    });
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@covidcare.in';
  };

  const testimonials = [
    {
      name: 'Eleanor Pena',
      role: 'Sunrise Health Patient',
      content: 'Great urgent care! Easy to make an appointment, got seen right away, the place was clean and tidy, and the staff was extremely friendly and helpful.',
      rating: 5,
      avatar: 'EP'
    },
    {
      name: 'Rahul Sharma',
      role: 'City Hospital Patient',
      content: 'Booking was so easy! Got my vaccination done without any hassle. The digital certificate feature is amazing.',
      rating: 5,
      avatar: 'RS'
    },
    {
      name: 'Dr. Priya Mehta',
      role: 'Apollo Hospital',
      content: 'Excellent platform for managing appointments and patient records. Highly recommended for healthcare providers.',
      rating: 5,
      avatar: 'PM'
    }
  ];

  const contactOptions = [
    { icon: Phone, label: 'Call', value: '1800-123-4567', action: 'Call Now', color: 'bg-primary/10 text-primary', onClick: handleCall },
    { icon: MessageCircle, label: 'Chat', value: 'Live Support', action: 'Chat Now', color: 'bg-secondary/10 text-secondary', onClick: handleChat },
    { icon: Video, label: 'Video Call', value: 'Virtual Consult', action: 'Video Call Now', color: 'bg-primary/10 text-primary', onClick: handleVideoCall },
    { icon: Mail, label: 'Email', value: 'support@covidcare.in', action: 'Send Email', color: 'bg-secondary/10 text-secondary', onClick: handleEmail },
  ];

  const partnerLogos = ['AstraZeneca', 'SINOVAC', 'Pfizer', 'Moderna'];

  const stats = [
    { value: dashboardStats.totalVaccinations.toLocaleString() + '+', label: 'Vaccinations', icon: Syringe },
    { value: dashboardStats.totalHospitals.toLocaleString() + '+', label: 'Hospitals', icon: Building2 },
    { value: dashboardStats.totalPatients.toLocaleString() + '+', label: 'Patients', icon: Users },
    { value: '24/7', label: 'Support', icon: Clock }
  ];

  // Use real news from context, fallback to static if empty
  const displayNews = news.length > 0 ? news.slice(0, 4) : [
    {
      id: '1',
      title: 'New COVID-19 Variant: What You Need to Know',
      excerpt: 'Health experts are monitoring a new variant that has emerged. Here is everything you need to know about symptoms and prevention.',
      image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400',
      category: 'Health Alert',
      date: '2026-01-02'
    },
    {
      id: '2',
      title: 'Vaccination Drive Reaches 1 Million Milestone',
      excerpt: 'Our vaccination program has successfully administered over 1 million doses, marking a significant achievement.',
      image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=400',
      category: 'Achievement',
      date: '2026-01-01'
    },
    {
      id: '3',
      title: 'Understanding Booster Shots: Complete Guide',
      excerpt: 'Everything you need to know about COVID-19 booster shots, eligibility, and benefits for enhanced protection.',
      image: 'https://images.unsplash.com/photo-1609601546183-5d8dd0dd8848?w=400',
      category: 'Guide',
      date: '2025-12-28'
    }
  ];

  // Use real vaccines from context
  const displayVaccines = vaccines.length > 0 ? vaccines.slice(0, 4) : [];
  const showMoreVaccines = vaccines.length > 4;

  const locations = demoHospitals.slice(0, 4);

  const services = [
    { icon: Syringe, title: 'Vaccination', description: 'All major COVID-19 vaccines available', color: 'from-primary to-primary/70' },
    { icon: TestTube, title: 'COVID Testing', description: 'RT-PCR & Rapid Antigen tests', color: 'from-secondary to-secondary/70' },
    { icon: Stethoscope, title: 'Consultation', description: 'Expert medical advice 24/7', color: 'from-primary to-secondary' },
    { icon: HeartPulse, title: 'Health Monitoring', description: 'Post-vaccination care & support', color: 'from-secondary to-primary' }
  ];

  const features = [
    { icon: CheckCircle2, title: 'Easy Booking', description: 'Book appointments in just 3 clicks' },
    { icon: Shield, title: 'Verified Centers', description: 'All hospitals are government approved' },
    { icon: Clock, title: 'Quick Results', description: 'Get test results within 24 hours' },
    { icon: Award, title: 'Digital Certificate', description: 'Download vaccination certificates instantly' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <Syringe className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">CovidCare</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Services</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
              <a href="#locations" className="text-muted-foreground hover:text-primary transition-colors font-medium">Locations</a>
              <a href="#database" className="text-muted-foreground hover:text-primary transition-colors font-medium">Database</a>
              <a href="#news" className="text-muted-foreground hover:text-primary transition-colors font-medium">News</a>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">About</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-primary/10">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {isAuthenticated ? (
                <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Link to={`/${role}/dashboard`}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/patient/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Link to="/patient/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-3">
                <a href="#services" className="text-muted-foreground hover:text-primary transition-colors py-2">Services</a>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors py-2">Contact</a>
                <a href="#locations" className="text-muted-foreground hover:text-primary transition-colors py-2">Locations</a>
                <a href="#database" className="text-muted-foreground hover:text-primary transition-colors py-2">Database</a>
                <a href="#news" className="text-muted-foreground hover:text-primary transition-colors py-2">News</a>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors py-2">About</Link>
                <div className="flex gap-2 pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <Button className="flex-1" asChild>
                      <Link to={`/${role}/dashboard`}>Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/patient/login">Login</Link>
                      </Button>
                      <Button className="flex-1" asChild>
                        <Link to="/patient/register">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Vaccine Center
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Find a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">COVID-19</span> Vaccine Near You
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                In order to avoid any doubts about getting the COVID-19 vaccine,
                identify the following 4 benefits of COVID-19 vaccination.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover-scale" asChild>
                  <Link to="/patient/register">
                    Get Vaccine Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 hover-scale" asChild>
                  <a href="#contact">Help Center</a>
                </Button>
              </div>

              {/* Scheduling Form */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mt-8 hover-lift">
                <h3 className="flex items-center gap-2 text-foreground font-semibold mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  Schedule your vaccinations
                </h3>
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </label>
                    <Select value={scheduleForm.location} onValueChange={(v) => setScheduleForm(prev => ({ ...prev, location: v }))}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </label>
                    <Input
                      type="date"
                      className="bg-muted/50"
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Syringe className="h-3 w-3" /> Vaccine Type
                    </label>
                    <Select value={scheduleForm.vaccineType} onValueChange={(v) => setScheduleForm(prev => ({ ...prev, vaccineType: v }))}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select Vaccine" />
                      </SelectTrigger>
                      <SelectContent>
                        {vaccines.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      onClick={handleScheduleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Area */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-secondary rounded-full w-96 h-96 mx-auto flex items-center justify-center shadow-2xl shadow-primary/20">
                  <div className="bg-card rounded-full w-80 h-80 flex items-center justify-center shadow-inner">
                    <div className="text-center p-8">
                      <Syringe className="h-24 w-24 mx-auto text-primary mb-4 animate-pulse" />
                      <p className="text-2xl font-bold text-foreground">COVID-19</p>
                      <p className="text-lg text-muted-foreground">Vaccination</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute top-10 right-0 bg-card shadow-xl rounded-2xl p-4 border border-border animate-fade-in hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-card" />
                      <div className="h-8 w-8 rounded-full bg-secondary/20 border-2 border-card" />
                      <div className="h-8 w-8 rounded-full bg-accent/20 border-2 border-card" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">20+</p>
                      <p className="text-xs text-muted-foreground">Specialists</p>
                    </div>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute bottom-10 left-0 bg-card shadow-xl rounded-2xl p-4 border border-border animate-fade-in hover-lift" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-secondary/10">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">98%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 border-y border-border bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-muted-foreground/50 hover:text-primary transition-all duration-300 cursor-pointer hover-scale"
              >
                {logo === 'SINOVAC' ? (
                  <span className="tracking-widest">SINO<span className="text-secondary">VAC</span></span>
                ) : logo === 'Pfizer' ? (
                  <span className="italic">℞ {logo}</span>
                ) : (
                  logo
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover-lift border-none shadow-lg bg-card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4 group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                    <stat.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive <span className="text-primary">Healthcare</span> Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a complete range of COVID-19 related healthcare services to keep you and your family safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift group cursor-pointer overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--primary), var(--secondary))` }} />
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-0">Why Choose Us</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Making Vaccination <span className="text-secondary">Simple & Safe</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We have streamlined the entire vaccination process to make it as easy and convenient as possible for everyone.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <feature.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
              <Card className="relative p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary to-primary">
                    <Activity className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">Real-time Tracking</p>
                    <p className="text-muted-foreground">Monitor your vaccination status</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-foreground">First Dose</span>
                    <Badge className="bg-secondary/20 text-secondary border-0">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-foreground">Second Dose</span>
                    <Badge className="bg-secondary/20 text-secondary border-0">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-foreground">Booster Shot</span>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-secondary to-primary" asChild>
                  <Link to="/patient/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Find Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vaccination <span className="text-primary">Centers</span> Near You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the nearest approved vaccination center and book your appointment today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <Card key={location.id} className="hover-lift group cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
                      <Building2 className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">{location.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{location.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{location.city}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to={`/patient/book-appointment/${location.id}`}>
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="hover-scale" asChild>
              <Link to="/patient/search-hospital">
                <Globe className="mr-2 h-5 w-5" />
                View All Locations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Database Section - Available Vaccines */}
      <section id="database" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-0">Vaccine Database</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Available <span className="text-secondary">Vaccines</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All vaccines are WHO approved and available at our certified vaccination centers.
            </p>
          </div>

          {displayVaccines.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayVaccines.map((vaccine, index) => (
                  <Card key={vaccine.id} className="hover-lift group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 mb-4 group-hover:from-secondary group-hover:to-primary transition-all duration-300">
                        <Syringe className="h-8 w-8 text-secondary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-1">{vaccine.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{vaccine.manufacturer}</p>
                      <Badge className="bg-secondary/10 text-secondary border-0">{vaccine.dosesRequired} Doses</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="hover-scale" asChild>
                  <Link to="/vaccines">
                    View All Vaccines
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Syringe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Loading vaccines...</p>
            </div>
          )}
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">24/7 Support</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Emergency Contact
              </h2>
              <p className="text-muted-foreground mb-8">
                Contact one of the contacts below if you or your family feel
                unwell and have similar symptoms such as COVID-19.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="hover-lift cursor-pointer group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${option.color} mb-3 group-hover:scale-110 transition-transform`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground mb-3">{option.value}</p>
                      <Button
                        variant={index % 2 === 0 ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={option.onClick}
                      >
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
                <div className="relative bg-card rounded-3xl p-8 shadow-xl border border-border hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                      <TestTube className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">COVID-19 Testing</p>
                      <p className="text-muted-foreground">Quick & Accurate Results</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary" />
                      <span className="text-muted-foreground">RT-PCR Testing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary" />
                      <span className="text-muted-foreground">Rapid Antigen Test</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary" />
                      <span className="text-muted-foreground">Home Collection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary" />
                      <span className="text-muted-foreground">Digital Reports</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary" asChild>
                    <Link to="/patient/search-hospital">
                      Get Covid-19 Test
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">Latest Updates</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="text-primary">News</span> & Articles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest COVID-19 news, health tips, and vaccination updates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {displayNews.slice(0, 3).map((article, index) => (
              <Link to={`/news/${article.id}`} key={article.id}>
                <Card className="overflow-hidden hover-lift group cursor-pointer h-full animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {article.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.date || article.created_at || new Date()).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      Read More <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="hover-scale" asChild>
              <Link to="/news">
                <Newspaper className="mr-2 h-5 w-5" />
                View All News
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-0">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="text-secondary">Reviews</span> From Our<br />
              Satisfied Patients
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden hover-lift">
              <CardContent className="p-8 text-center">
                {/* Decorative virus icon */}
                <div className="absolute -top-6 -left-6 w-24 h-24 text-primary/10">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="30" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle} 50 50)`}>
                        <rect x="47" y="10" width="6" height="20" rx="3" />
                        <circle cx="50" cy="5" r="5" />
                      </g>
                    ))}
                  </svg>
                </div>

                <p className="text-lg text-muted-foreground mb-6 relative z-10 italic">
                  "{testimonials[currentTestimonial].content}"
                </p>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning fill-warning" />
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-3 rounded-full transition-all ${index === currentTestimonial
                        ? 'bg-primary w-8'
                        : 'bg-primary/30 w-3 hover:bg-primary/50'
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover-scale"
                onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover-scale"
                onClick={() => setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary via-primary to-secondary rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
            <CardContent className="p-8 md:p-12 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Vaccinated?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of people who have already protected themselves and their families.
                Book your appointment today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 hover-scale" asChild>
                  <Link to="/patient/register">
                    Register Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover-scale"
                  asChild
                >
                  <a href="tel:1800-123-4567">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Helpline
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
