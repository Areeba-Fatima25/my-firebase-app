import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Building2,
  Calendar,
  FileText,
  Syringe,
  Users,
  BarChart3,
  Pill,
  Settings,
  LogOut,
  TestTube,
  Shield,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ElementType;
}

const DashboardSidebar = () => {
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const getLinks = (): SidebarLink[] => {
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
          { to: '/hospital/patients', label: 'Patients', icon: Users },
          { to: '/hospital/covid-tests', label: 'Covid Tests', icon: TestTube },
          { to: '/hospital/vaccinations', label: 'Vaccinations', icon: Syringe },
          { to: '/hospital/settings', label: 'Settings', icon: Settings },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
          { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
          { to: '/admin/vaccines', label: 'Vaccines', icon: Pill },
          { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
          { to: '/admin/news', label: 'News', icon: Newspaper },
          { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const isActive = (path: string) => location.pathname === path;

  const getRoleGradient = () => {
    switch (role) {
      case 'admin': return 'from-destructive to-destructive/80';
      case 'hospital': return 'from-secondary to-secondary/80';
      default: return 'from-primary to-primary/80';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'admin': return Shield;
      case 'hospital': return Building2;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to={`/${role}/dashboard`} className="flex items-center gap-2 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
              <Syringe className="h-5 w-5 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-warning animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">CovidCare</span>
              <span className="text-[10px] text-sidebar-foreground/60">Healthcare Platform</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <Syringe className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={cn(
        "p-4 border-b border-sidebar-border",
        collapsed && "flex justify-center"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <div className={cn(
            "relative flex items-center justify-center rounded-2xl bg-gradient-to-br text-primary-foreground shadow-lg",
            getRoleGradient(),
            collapsed ? "h-10 w-10" : "h-12 w-12"
          )}>
            <RoleIcon className={cn(collapsed ? "h-5 w-5" : "h-6 w-6")} />
            <Zap className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-warning" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize flex items-center gap-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  role === 'admin' ? 'bg-destructive' : role === 'hospital' ? 'bg-secondary' : 'bg-primary'
                )} />
                {role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className={cn(
          "text-[10px] uppercase tracking-wider text-sidebar-foreground/50 mb-2",
          collapsed && "text-center"
        )}>
          {collapsed ? '•••' : 'Navigation'}
        </p>
        {links.map((link) => {
          const LinkIcon = link.icon;
          const active = isActive(link.to);

          const linkContent = (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                active
                  ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <LinkIcon className={cn(
                "shrink-0 transition-transform group-hover:scale-110",
                collapsed ? "h-5 w-5" : "h-5 w-5"
              )} />
              {!collapsed && (
                <span className="font-medium">{link.label}</span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground" />
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={link.to} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {link.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {/* Theme Toggle */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200",
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-warning" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {!collapsed && <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="ml-2">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={logout}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200",
                "text-destructive hover:bg-destructive/10",
                collapsed && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="ml-2">
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
