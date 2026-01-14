import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Syringe,
  Menu,
  X,
  User,
  Building2,
  Shield,
  LogOut,
  Home,
  Calendar,
  FileText,
  Settings,
  Users,
  BarChart3,
  Pill,
  Moon,
  Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, logout, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Home', icon: Home },
        { to: '/vaccines', label: 'Vaccines', icon: Syringe },
        { to: '/news', label: 'News', icon: FileText },
        { to: '/about', label: 'About', icon: User },
      ];
    }

    switch (role) {
      case 'patient':
        return [
          { to: '/patient/dashboard', label: 'Dashboard', icon: Home },
          { to: '/patient/search-hospital', label: 'Find Hospital', icon: Building2 },
          { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
          { to: '/patient/reports', label: 'Reports', icon: FileText },
          { to: '/patient/settings', label: 'Settings', icon: Settings },
        ];
      case 'hospital':
        return [
          { to: '/hospital/dashboard', label: 'Dashboard', icon: Home },
          { to: '/hospital/appointments', label: 'Appointments', icon: Calendar },
          { to: '/hospital/covid-tests', label: 'Covid Tests', icon: FileText },
          { to: '/hospital/vaccinations', label: 'Vaccinations', icon: Syringe },
          { to: '/hospital/settings', label: 'Settings', icon: Settings },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
          { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
          { to: '/admin/vaccines', label: 'Vaccines', icon: Pill },
          { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
          { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? `/${role}/dashboard` : '/'} className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
              <Syringe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block text-foreground">
              CovidCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(link.to)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-primary/10">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs capitalize text-primary font-medium">{role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${role}/dashboard`} className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {role === 'patient' && (
                    <DropdownMenuItem asChild>
                      <Link to="/patient/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/patient/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Link to="/patient/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(link.to)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-4 mt-2 border-t border-border">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/patient/login" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-primary to-secondary" asChild>
                    <Link to="/patient/register" onClick={() => setIsOpen(false)}>Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
