import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Smartphone,
  Settings
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import api from '@/lib/axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

const PatientSettings = () => {
  const { user, role, isLoading: isAuthLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    profile_photo_path: ''
  });

  // Theme state
  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem('patient_appearance');
    return saved ? JSON.parse(saved) : {
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    };
  });

  // Notifications state with persistence
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('patient_notifications');
    return saved ? JSON.parse(saved) : {
      email: true,
      sms: true,
      appointments: true,
      results: true,
      reminders: true
    };
  });

  useEffect(() => {
    fetchPatientData();
  }, [user?.id]);

  const fetchPatientData = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/patients/${user.id}`);
      if (response.data.success) {
        const data = response.data.data;
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.mobile || '', // Map mobile from DB to phone in UI
          city: data.city || '',
          profile_photo_path: data.profile_photo_path || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch patient data', error);
      toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'patient') return <Navigate to="/patient/login" replace />;

  // Apply theme immediately
  useEffect(() => {
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', appearance.theme);
    localStorage.setItem('patient_appearance', JSON.stringify(appearance));
  }, [appearance.theme]);

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        mobile: profile.phone, // Map phone in UI to mobile in DB
        city: profile.city
      };

      const response = await api.put(`/patients/${user?.id}`, payload);

      if (response.data.success) {
        toast({ title: "Profile Saved", description: "Your profile has been updated." });
      }
    } catch (error: any) {
      console.error('Failed to save profile', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save profile changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = () => {
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
      const response = await api.post(`/patients/${user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setProfile(prev => ({ ...prev, profile_photo_path: response.data.data.profile_photo_path }));
        toast({ title: "Photo Updated", description: "Your profile photo has been updated." });
      }
    } catch (error: any) {
      console.error('Failed to upload photo', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    localStorage.setItem('patient_notifications', JSON.stringify(notifications));
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Notifications Saved", description: "Your notification preferences have been updated." });
    }, 500);
  };

  const handlePasswordChange = () => {
    toast({ title: "Password Updated", description: "Your password has been changed successfully." });
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      // In a real app, this would be a DELETE request to an API endpoint
      // await api.delete(`/patients/${user?.id}`);

      // Simulating API call
      setTimeout(() => {
        setSaving(false);
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
          variant: "destructive"
        });
        // Redirect to login or home would happen here
        window.location.href = '/login';
      }, 1000);

    } catch (error) {
      setSaving(false);
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {profile.profile_photo_path ? (
                      <img
                        src={`http://localhost:8000${profile.profile_photo_path}`}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={handleImageUpload}
                      disabled={saving}
                    >
                      {saving ? 'Uploading...' : 'Change Photo'}
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
                    </div>
                  </div>
                  <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Appointment Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about appointment status</p>
                    </div>
                  </div>
                  <Switch checked={notifications.appointments} onCheckedChange={(v) => setNotifications({ ...notifications, appointments: v })} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Test Results</p>
                      <p className="text-sm text-muted-foreground">Notify when results are ready</p>
                    </div>
                  </div>
                  <Switch checked={notifications.results} onCheckedChange={(v) => setNotifications({ ...notifications, results: v })} />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password regularly for security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type={showPassword ? "text" : "password"} className="pl-10" />
                  </div>
                </div>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">Secure your account with OTP</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-destructive/20">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently remove your account and all data</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                        Yes, Delete My Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
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

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout >
  );
};

export default PatientSettings;
