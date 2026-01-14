import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, Heart, Users, Award, Target, Lightbulb,
  CheckCircle, ArrowRight, Sparkles, Globe, Zap,
  Smartphone, Brain, Video, Bell, CreditCard,
  Syringe, Moon, Sun, Menu, X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  if (loading) return <PageLoader />;

  const stats = [
    { value: "50+", label: "Partner Hospitals", icon: Heart },
    { value: "100K+", label: "Patients Served", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "24/7", label: "Support", icon: Award }
  ];

  const values = [
    { title: "Patient First", description: "Every decision we make prioritizes patient health and convenience", icon: Heart },
    { title: "Innovation", description: "Continuously improving healthcare technology for better outcomes", icon: Lightbulb },
    { title: "Trust & Security", description: "Your health data is protected with enterprise-grade security", icon: Shield },
    { title: "Accessibility", description: "Making healthcare accessible to everyone, everywhere", icon: Target }
  ];

  const team = [
    { name: "Dr. Sarah Johnson", role: "Chief Medical Officer", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300" },
    { name: "Michael Chen", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" },
    { name: "Dr. Emily Williams", role: "Head of Research", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300" },
    { name: "James Rodriguez", role: "CTO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" }
  ];

  const futureFeatures = [
    { title: "AI Health Assistant", description: "Advanced AI-powered health recommendations and symptom analysis", icon: Brain, status: "Coming Soon" },
    { title: "Telemedicine", description: "Video consultations with doctors from the comfort of your home", icon: Video, status: "In Development" },
    { title: "Smart Notifications", description: "Personalized health reminders and medication alerts", icon: Bell, status: "Planned" },
    { title: "Mobile App", description: "Native iOS and Android apps for on-the-go healthcare management", icon: Smartphone, status: "Coming Soon" },
    { title: "Insurance Integration", description: "Seamless integration with major health insurance providers", icon: CreditCard, status: "Planned" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Same Navigation as Homepage */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <Syringe className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">CovidCare</span>
            </Link>

            {/* Desktop Nav - Same as Homepage */}
            <div className="hidden md:flex items-center gap-6">
              <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Services</a>
              <a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
              <a href="/#locations" className="text-muted-foreground hover:text-primary transition-colors font-medium">Locations</a>
              <a href="/#database" className="text-muted-foreground hover:text-primary transition-colors font-medium">Database</a>
              <a href="/#news" className="text-muted-foreground hover:text-primary transition-colors font-medium">News</a>
              <Link to="/about" className="text-primary font-medium">About</Link>
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
                <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors py-2">Services</a>
                <a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors py-2">Contact</a>
                <a href="/#locations" className="text-muted-foreground hover:text-primary transition-colors py-2">Locations</a>
                <a href="/#database" className="text-muted-foreground hover:text-primary transition-colors py-2">Database</a>
                <a href="/#news" className="text-muted-foreground hover:text-primary transition-colors py-2">News</a>
                <Link to="/about" className="text-primary font-medium py-2">About</Link>
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 animate-fade-in" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" /> About CovidCare
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-fade-in">
              Revolutionizing Healthcare Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              We're on a mission to make vaccination tracking and healthcare management
              seamless, accessible, and efficient for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/patient/register">
                <Button size="lg" className="group">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/#contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge variant="outline" className="mb-4">Our Mission</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Making Healthcare <span className="text-primary">Accessible</span> for All
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                CovidCare was founded with a simple yet powerful vision: to create a unified platform
                that connects patients, hospitals, and healthcare providers, making vaccination
                tracking and healthcare management effortless.
              </p>
              <ul className="space-y-4">
                {["Streamlined appointment booking", "Real-time vaccine tracking", "Secure health records", "24/7 customer support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600"
                alt="Healthcare Team"
                className="rounded-3xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet the Experts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="pt-4 text-center">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-3 h-3 mr-1" /> Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Future Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're constantly innovating to bring you the best healthcare management experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {futureFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-dashed animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">{feature.status}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <CardContent className="py-12 text-center relative z-10">
              <Globe className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of patients and healthcare providers who trust CovidCare
                for their vaccination and healthcare management needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/patient/register">
                  <Button size="lg" variant="secondary" className="group">
                    Create Account <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/hospital/register">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Register Hospital
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
