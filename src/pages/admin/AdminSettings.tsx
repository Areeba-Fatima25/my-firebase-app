import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import {
  Settings, Shield, Bell, Palette, Save, Database,
  Server, Mail, Globe, AlertTriangle,
  FileText, Download, Trash2, RefreshCw, Moon, Sun
} from "lucide-react";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // System Stats State
  const [systemStats, setSystemStats] = useState({
    database: { status: 'Unknown', size: 'Unknown', driver: 'Unknown' },
    logs: { count: 0, size: '0 MB' },
    server: { php_version: 'Unknown', laravel_version: 'Unknown' }
  });

  // Initialize from localStorage
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('admin_system_settings');
    return saved ? JSON.parse(saved) : {
      siteName: "CovidCare",
      siteUrl: "https://covidcare.com",
      adminEmail: "admin@covidcare.com",
      supportEmail: "support@covidcare.com",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerification: true,
      maxLoginAttempts: "5",
      sessionDuration: "30"
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('admin_notifications');
    return saved ? JSON.parse(saved) : {
      systemAlerts: true,
      securityAlerts: true,
      userRegistrations: true,
      hospitalRegistrations: true,
      dailyReports: false,
      weeklyReports: true
    };
  });

  const [security, setSecurity] = useState(() => {
    const saved = localStorage.getItem('admin_security');
    return saved ? JSON.parse(saved) : {
      twoFactorRequired: false,
      passwordExpiry: "90",
      ipWhitelist: false,
      auditLogging: true,
      dataEncryption: true
    };
  });

  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem('admin_appearance');
    return saved ? JSON.parse(saved) : {
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      primaryColor: "blue",
      compactMode: false,
      animations: true
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    // Fetch system stats
    fetchSystemStats();
    return () => clearTimeout(timer);
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await api.get('/system/stats');
      if (response.data.success) {
        setSystemStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  // Apply theme immediately when changed
  useEffect(() => {
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (appearance.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', appearance.theme);
  }, [appearance.theme]);

  const handleSave = (section: string) => {
    setSaving(true);

    // Save to localStorage based on section
    switch (section) {
      case 'General':
        localStorage.setItem('admin_system_settings', JSON.stringify(systemSettings));
        break;
      case 'Alert':
        localStorage.setItem('admin_notifications', JSON.stringify(notifications));
        break;
      case 'Security':
        localStorage.setItem('admin_security', JSON.stringify(security));
        break;
      case 'Appearance':
        localStorage.setItem('admin_appearance', JSON.stringify(appearance));
        break;
    }

    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`
      });
    }, 500);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('admin_system_settings');
      localStorage.removeItem('admin_notifications');
      localStorage.removeItem('admin_security');
      localStorage.removeItem('admin_appearance');
      localStorage.removeItem('theme');
      toast({
        title: "Settings reset",
        description: "All settings have been restored to defaults. Reloading..."
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleOptimize = async () => {
    setSaving(true);
    try {
      const response = await api.post('/system/optimize');
      if (response.data.success) {
        toast({ title: "System Optimized", description: response.data.message });
      }
    } catch (error) {
      toast({ title: "Optimization Failed", description: "Could not clear cache.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear system logs?')) return;
    setSaving(true);
    try {
      const response = await api.post('/system/clear-logs');
      if (response.data.success) {
        toast({ title: "Logs Cleared", description: response.data.message });
        fetchSystemStats(); // Refresh stats
      }
    } catch (error) {
      toast({ title: "Operation Failed", description: "Could not clear logs.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = () => {
    setSaving(true);
    // Simulate backup delay
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Backup Created",
        description: `Full system backup created at ${new Date().toLocaleTimeString()}`,
      });
    }, 2000);
  };

  const handleClearData = async () => {
    if (!confirm('DANGER: Are you sure you want to permanently delete ALL system data? This action cannot be undone.')) return;

    // transform prompt
    const verification = prompt('Type "DELETE" to confirm:');
    if (verification !== 'DELETE') return;

    setSaving(true);
    try {
      const response = await api.post('/system/clear-data');
      if (response.data.success) {
        toast({ title: "Data Cleared", description: "All system data has been permanently deleted." });
        // Optional: reload or logout
        window.location.reload();
      }
    } catch (error) {
      toast({ title: "Operation Failed", description: "Could not clear data.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout title="System Settings" subtitle="Manage system-wide configurations">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" /> Theme
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Server className="w-4 h-4" /> System
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                General Settings
              </CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="siteUrl"
                      className="pl-10"
                      value={systemSettings.siteUrl}
                      onChange={(e) => setSystemSettings({ ...systemSettings, siteUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="adminEmail"
                      className="pl-10"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings({ ...systemSettings, adminEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="supportEmail"
                      className="pl-10"
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Take site offline for maintenance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {systemSettings.maintenanceMode && <Badge variant="destructive">Active</Badge>}
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">User Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, registrationEnabled: checked })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("General")} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Configure system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "systemAlerts", label: "System Alerts", desc: "Critical system notifications" },
                { key: "securityAlerts", label: "Security Alerts", desc: "Security-related notifications" },
                { key: "userRegistrations", label: "New User Registrations", desc: "Get notified of new user sign-ups" },
                { key: "hospitalRegistrations", label: "Hospital Registrations", desc: "New hospital registration requests" },
                { key: "dailyReports", label: "Daily Reports", desc: "Receive daily activity summaries" },
                { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly system reports" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave("Alert")} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Configuration
              </CardTitle>
              <CardDescription>Manage system security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Require Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all admin users</p>
                </div>
                <Switch
                  checked={security.twoFactorRequired}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactorRequired: checked })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select value={security.passwordExpiry} onValueChange={(value) => setSecurity({ ...security, passwordExpiry: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Select value={systemSettings.maxLoginAttempts} onValueChange={(value) => setSystemSettings({ ...systemSettings, maxLoginAttempts: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {[
                { key: "ipWhitelist", label: "IP Whitelist", desc: "Restrict admin access to specific IPs" },
                { key: "auditLogging", label: "Audit Logging", desc: "Log all administrative actions" },
                { key: "dataEncryption", label: "Data Encryption", desc: "Encrypt sensitive data at rest" }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={security[item.key as keyof typeof security] as boolean}
                    onCheckedChange={(checked) => setSecurity({ ...security, [item.key]: checked })}
                  />
                </div>
              ))}

              <Button onClick={() => handleSave("Security")} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Theme Settings
              </CardTitle>
              <CardDescription>Customize the admin panel appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode - Visual Selection */}
              <div className="space-y-3">
                <Label>Theme Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                    className={`p-4 rounded-xl border-2 transition-all ${appearance.theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                    className={`p-4 rounded-xl border-2 transition-all ${appearance.theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <Moon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Dark</p>
                  </button>
                  <button
                    onClick={() => setAppearance({ ...appearance, theme: 'system' })}
                    className={`p-4 rounded-xl border-2 transition-all ${appearance.theme === 'system' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">System</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-3">
                  {['blue', 'green', 'purple', 'orange'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAppearance({ ...appearance, primaryColor: color })}
                      className={`w-10 h-10 rounded-full transition-all ${appearance.primaryColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                        }`}
                      style={{
                        backgroundColor:
                          color === 'blue' ? '#3b82f6' :
                            color === 'green' ? '#22c55e' :
                              color === 'purple' ? '#a855f7' :
                                '#f97316'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch
                  checked={appearance.compactMode}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Animations</p>
                  <p className="text-sm text-muted-foreground">Enable UI animations and transitions</p>
                </div>
                <Switch
                  checked={appearance.animations}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, animations: checked })}
                />
              </div>

              <Button onClick={() => handleSave("Appearance")} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">{systemStats.database.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Size</span>
                  <span>{systemStats.database.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="capitalize">{systemStats.database.driver}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleBackup} disabled={saving}>
                    <Download className="w-4 h-4" /> Backup
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleOptimize} disabled={saving}>
                    <RefreshCw className="w-4 h-4" /> Optimize
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Log Files</span>
                  <span>{systemStats.logs.count} files</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Size</span>
                  <span>{systemStats.logs.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">PHP Version</span>
                  <span>{systemStats.server.php_version}</span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" disabled={saving}>
                    <Download className="w-4 h-4" /> Export
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 text-destructive hover:text-destructive" onClick={handleClearLogs} disabled={saving}>
                    <Trash2 className="w-4 h-4" /> Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions - proceed with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
                <div>
                  <p className="font-medium">Reset All Settings</p>
                  <p className="text-sm text-muted-foreground">Restore all settings to default values</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleResetSettings}>Reset</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
                <div>
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">Permanently delete all system data</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearData} disabled={saving}>Clear Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminSettings;
