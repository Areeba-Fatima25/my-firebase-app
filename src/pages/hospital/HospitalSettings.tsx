import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import {
  Building2, MapPin, Phone, Mail, Clock, Shield, Bell,
  Palette, Save, Upload, Globe, Users, Calendar, Lock, Moon, Sun, Settings
} from "lucide-react";

const HospitalSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Data State
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    description: "",
    operatingHours: "24/7",
    emergencyServices: false,
    vaccineServices: false,
    covidTesting: false,
    profile_photo_path: ""
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('hospital_notifications');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      systemAlerts: true,
      marketingEmails: false,
      weeklyReports: true
    };
  });

  const [security, setSecurity] = useState(() => {
    const saved = localStorage.getItem('hospital_security');
    return saved ? JSON.parse(saved) : {
      twoFactorAuth: false,
      sessionTimeout: "30",
      ipRestriction: false
    };
  });

  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem('hospital_appearance');
    return saved ? JSON.parse(saved) : {
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      compactMode: false,
      showStatistics: true
    };
  });

  useEffect(() => {
    fetchHospitalData();
  }, [user?.id]); // Re-fetch if user ID changes

  const fetchHospitalData = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/hospitals/${user.id}`);
      if (response.data.success) {
        const data = response.data.data;
        setHospitalInfo({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zip_code || "",
          website: data.website || "",
          description: data.description || "",
          // These fields might not be in the backend yet, defaulting for UI
          operatingHours: "24/7",
          emergencyServices: true,
          vaccineServices: true,
          covidTesting: true,
          profile_photo_path: data.profile_photo_path || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch hospital data:", error);
      toast({
        title: "Error",
        description: "Failed to load hospital profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply theme immediately when changed
  useEffect(() => {
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (appearance.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', appearance.theme);
    localStorage.setItem('hospital_appearance', JSON.stringify(appearance));
  }, [appearance.theme]);

  const handleSave = async (section: string) => {
    setSaving(true);

    if (section === 'profile') {
      try {
        // Map frontend camelCase to backend snake_case
        const payload = {
          name: hospitalInfo.name,
          email: hospitalInfo.email,
          phone: hospitalInfo.phone,
          address: hospitalInfo.address,
          city: hospitalInfo.city,
          state: hospitalInfo.state,
          zip_code: hospitalInfo.zipCode,
          website: hospitalInfo.website,
          description: hospitalInfo.description
        };

        const response = await api.put(`/hospitals/${user?.id}`, payload);

        if (response.data.success) {
          toast({
            title: "Settings saved",
            description: `Your profile settings have been updated successfully.`
          });
        }
      } catch (error: any) {
        console.error("Failed to save profile:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to save profile changes.",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
      return;
    }

    // Local Storage save for other sections
    switch (section) {
      case 'notification':
        localStorage.setItem('hospital_notifications', JSON.stringify(notifications));
        break;
      case 'security':
        localStorage.setItem('hospital_security', JSON.stringify(security));
        break;
      case 'appearance':
        localStorage.setItem('hospital_appearance', JSON.stringify(appearance));
        break;
    }

    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated successfully.`
      });
    }, 500);
  };

  const handleLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_photo', file);
    formData.append('_method', 'PUT'); // Spoof PUT method for Laravel

    try {
      setSaving(true);
      const response = await api.post(`/hospitals/${user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setHospitalInfo(prev => ({ ...prev, profile_photo_path: response.data.data.profile_photo_path }));
        toast({ title: "Logo Updated", description: "Your hospital logo has been updated." });
      }
    } catch (error: any) {
      console.error('Failed to upload logo', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload logo",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <DashboardLayout title="Hospital Settings" subtitle="Manage your hospital profile and preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" /> Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Hospital Information
              </CardTitle>
              <CardDescription>Update your hospital's public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {hospitalInfo.profile_photo_path ? (
                    <img
                      src={`http://localhost:8000${hospitalInfo.profile_photo_path}`}
                      alt={hospitalInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary" />
                  )}
                </div>
                <Button variant="outline" className="gap-2" onClick={handleLogoUpload} disabled={saving}>
                  <Upload className="w-4 h-4" /> {saving ? 'Uploading...' : 'Upload Logo'}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hospital Name</Label>
                  <Input
                    id="name"
                    value={hospitalInfo.name}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      className="pl-10"
                      value={hospitalInfo.email}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={hospitalInfo.phone}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      className="pl-10"
                      value={hospitalInfo.website}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    className="pl-10"
                    value={hospitalInfo.address}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={hospitalInfo.city}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={hospitalInfo.state}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={hospitalInfo.zipCode}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={hospitalInfo.description}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Services Offered</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>Emergency Services</span>
                    </div>
                    <Switch
                      checked={hospitalInfo.emergencyServices}
                      onCheckedChange={(checked) => setHospitalInfo({ ...hospitalInfo, emergencyServices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span>Vaccine Services</span>
                    </div>
                    <Switch
                      checked={hospitalInfo.vaccineServices}
                      onCheckedChange={(checked) => setHospitalInfo({ ...hospitalInfo, vaccineServices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>COVID Testing</span>
                    </div>
                    <Switch
                      checked={hospitalInfo.covidTesting}
                      onCheckedChange={(checked) => setHospitalInfo({ ...hospitalInfo, covidTesting: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("profile")} disabled={saving} className="gap-2">
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
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "emailNotifications", label: "Email Notifications", desc: "Receive important updates via email" },
                { key: "smsNotifications", label: "SMS Notifications", desc: "Get text messages for urgent alerts" },
                { key: "appointmentReminders", label: "Appointment Reminders", desc: "Receive reminders before scheduled appointments" },
                { key: "systemAlerts", label: "System Alerts", desc: "Get notified about system updates and maintenance" },
                { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly summary of hospital activities" },
                { key: "marketingEmails", label: "Marketing Emails", desc: "Receive promotional content and updates" }
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
              <Button onClick={() => handleSave("notification")} disabled={saving} className="gap-2">
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
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-3">
                  {security.twoFactorAuth && <Badge variant="secondary">Enabled</Badge>}
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">IP Restriction</p>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  checked={security.ipRestriction}
                  onCheckedChange={(checked) => setSecurity({ ...security, ipRestriction: checked })}
                />
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="font-medium">Change Password</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                </div>
                <Button variant="outline" className="mt-4">Update Password</Button>
              </div>

              <Button onClick={() => handleSave("security")} disabled={saving} className="gap-2">
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
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={appearance.theme} onValueChange={(value) => setAppearance({ ...appearance, theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Show more content with smaller spacing</p>
                </div>
                <Switch
                  checked={appearance.compactMode}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Show Statistics</p>
                  <p className="text-sm text-muted-foreground">Display statistics on dashboard</p>
                </div>
                <Switch
                  checked={appearance.showStatistics}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, showStatistics: checked })}
                />
              </div>

              <Button onClick={() => handleSave("appearance")} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default HospitalSettings;
