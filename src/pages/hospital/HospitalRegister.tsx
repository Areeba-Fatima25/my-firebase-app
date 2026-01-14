import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, Phone, Lock, MapPin, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cities } from '@/lib/demoData';

const HospitalRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { registerHospital } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return '';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Mobile/Phone validation (Pakistani format)
  const validatePhone = (phone: string) => {
    const mobileRegex = /^3[0-9]{9}$/;
    if (!phone) return '';
    if (!mobileRegex.test(phone)) return 'Enter 10 digits starting with 3 (e.g., 3001234567)';
    return '';
  };

  // Password strength checker
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-destructive' };
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-warning' };
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  }, [formData.password]);

  const passwordChecks = useMemo(() => {
    const password = formData.password;
    return [
      { label: 'At least 8 characters', valid: password.length >= 8 },
      { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
      { label: 'Number', valid: /[0-9]/.test(password) },
      { label: 'Special character', valid: /[^a-zA-Z0-9]/.test(password) },
    ];
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Only allow digits and limit to 10 characters
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone: cleaned });
      setPhoneError(validatePhone(cleaned));
      return;
    }

    if (name === 'email') {
      setFormData({ ...formData, email: value });
      setEmailError(validateEmail(value));
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      setEmailError(emailErr);
      toast({ title: 'Invalid Email', description: emailErr, variant: 'destructive' });
      return;
    }

    // Validate phone
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      toast({ title: 'Invalid Phone', description: phoneErr, variant: 'destructive' });
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 2) {
      toast({ title: 'Weak Password', description: 'Please choose a stronger password.', variant: 'destructive' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Password mismatch', description: 'Passwords do not match. Please try again.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    const success = await registerHospital({
      name: formData.name,
      email: formData.email,
      phone: `+92${formData.phone}`,
      address: formData.address,
      city: formData.city,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    });

    if (success) {
      toast({ title: 'Registration submitted!', description: 'Your registration is pending admin approval.' });
      navigate('/hospital/login');
    } else {
      toast({ title: 'Registration failed', description: 'Hospital with this email already exists.', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Hospital Registration</h1>
          <p className="text-muted-foreground mt-1">Join our healthcare network</p>
        </div>

        <Card className="animate-fade-in-up shadow-lg">
          <CardHeader>
            <CardTitle>Register Your Hospital</CardTitle>
            <CardDescription>Fill in your hospital details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hospital Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Hospital name"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className={`pl-10 ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm font-medium text-muted-foreground">
                      +92
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="3001234567"
                        className={`pl-10 rounded-l-none ${phoneError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                  {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Address"
                    className="pl-10"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all ${passwordStrength.score >= level ? passwordStrength.color : 'bg-muted'
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${passwordStrength.score === 1 ? 'text-destructive' :
                        passwordStrength.score === 2 ? 'text-warning' : 'text-green-500'
                        }`}>
                        Password: {passwordStrength.label}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {passwordChecks.map((check, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs">
                            {check.valid ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <X className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={check.valid ? 'text-green-500' : 'text-muted-foreground'}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      className={`pl-10 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-destructive' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-sm text-warning">
                Note: Your registration will be reviewed by admin before approval.
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Registration'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already registered?{' '}
              <Link to="/hospital/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HospitalRegister;
