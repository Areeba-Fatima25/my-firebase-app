import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Syringe, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, MapPin, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cities } from '@/lib/demoData';

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const { registerPatient } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return '';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  // Mobile validation (Pakistani format)
  const validateMobile = (mobile: string) => {
    const mobileRegex = /^3[0-9]{9}$/;
    if (!mobile) return '';
    if (!mobileRegex.test(mobile)) return 'Enter 10 digits starting with 3 (e.g., 3001234567)';
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

    if (name === 'mobile') {
      // Only allow digits and limit to 10 characters
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, mobile: cleaned });
      setMobileError(validateMobile(cleaned));
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

    // Validate mobile
    const mobileErr = validateMobile(formData.mobile);
    if (mobileErr) {
      setMobileError(mobileErr);
      toast({ title: 'Invalid Mobile', description: mobileErr, variant: 'destructive' });
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

    const success = await registerPatient({
      name: formData.name,
      email: formData.email,
      mobile: `+92${formData.mobile}`,
      dob: formData.dob,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      address: formData.address,
      city: formData.city,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    });

    if (success) {
      toast({ title: 'Registration successful!', description: 'You can now login with your credentials.' });
      navigate('/patient/login');
    } else {
      toast({ title: 'Registration failed', description: 'An account with this email already exists.', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Syringe className="h-8 w-8 text-primary" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1">Register as a patient to book appointments</p>
        </div>

        <Card className="animate-fade-in-up shadow-lg" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Patient Registration</CardTitle>
            <CardDescription>Fill in your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className="pl-10"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm font-medium text-muted-foreground">
                      +92
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        name="mobile"
                        placeholder="3001234567"
                        className={`pl-10 rounded-l-none ${mobileError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                  {mobileError && <p className="text-xs text-destructive">{mobileError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      className="pl-10"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter your address"
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
                      placeholder="Create password"
                      className="pl-10 pr-10"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{' '}
              <Link to="/patient/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PatientRegister;
