import { Link } from 'react-router-dom';
import { Syringe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Stay Updated</h3>
              <p className="text-background/70 text-sm">Get the latest COVID-19 news and health tips delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 w-full md:w-64" 
              />
              <Button className="bg-primary hover:bg-primary/90 shrink-0">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Syringe className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">CovidCare</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Your trusted partner in Covid-19 vaccination and testing. 
              Safe, efficient, and accessible healthcare for everyone.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background/10 hover:bg-primary/20 hover:scale-110 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background/10 hover:bg-primary/20 hover:scale-110 transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background/10 hover:bg-primary/20 hover:scale-110 transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background/10 hover:bg-primary/20 hover:scale-110 transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/patient/register" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/hospital/register" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Hospital Registration
                </Link>
              </li>
              <li>
                <Link to="/patient/search-hospital" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Find Hospitals
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/patient/search-hospital" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Covid-19 Testing
                </Link>
              </li>
              <li>
                <Link to="/patient/register" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Vaccination
                </Link>
              </li>
              <li>
                <Link to="/patient/reports" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Health Certificates
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Consultation
                </a>
              </li>
              <li>
                <a href="tel:1800-123-4567" className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Emergency Care
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-background/70 group hover:text-background transition-colors cursor-pointer">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>123 Healthcare Avenue, Mumbai 400001, India</span>
              </li>
              <li>
                <a href="tel:1800-123-4567" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>1800-123-4567 (Toll Free)</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@covidcare.in" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@covidcare.in</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2026 CovidCare. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Cookie Policy</a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
