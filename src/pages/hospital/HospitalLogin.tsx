import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';


const HospitalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginHospital } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await loginHospital(email, password);
    if (result.success) {
      toast({ title: 'Welcome!', description: 'You have successfully logged in.' });
      navigate('/hospital/dashboard');
    } else {
      toast({ title: 'Login failed', description: result.message, variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/10"><Building2 className="h-8 w-8 text-primary" /></div>
          </Link>
          <h1 className="text-2xl font-bold">Hospital Portal</h1>
          <p className="text-muted-foreground mt-1">Sign in to manage appointments</p>
        </div>
        <Card className="animate-fade-in-up shadow-lg">
          <CardHeader><CardTitle>Hospital Login</CardTitle><CardDescription>Enter your credentials</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">

            <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/hospital/register" className="text-primary font-medium hover:underline">Register here</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HospitalLogin;
