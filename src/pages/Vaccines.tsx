import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/ui/loading-spinner';
import { Syringe, Search, Shield, CheckCircle, Moon, Sun, Menu, X } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';

const Vaccines = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDark, setIsDark] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { vaccines } = useAppointments();
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

    const filteredVaccines = vaccines.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <PageLoader />;

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
                            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">About</Link>
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
                                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors py-2">About</Link>
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
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-secondary/10 text-secondary border-0">
                            <Shield className="w-3 h-3 mr-1" /> WHO Approved
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Available <span className="text-secondary">Vaccines</span>
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            Browse all COVID-19 vaccines available at our certified vaccination centers.
                            All vaccines are WHO approved and administered by trained healthcare professionals.
                        </p>

                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search vaccines..."
                                className="pl-10 bg-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vaccines Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {filteredVaccines.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVaccines.map((vaccine, index) => (
                                <Card key={vaccine.id} className="hover-lift group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 group-hover:from-secondary group-hover:to-primary transition-all duration-300">
                                                <Syringe className="h-8 w-8 text-secondary group-hover:text-primary-foreground transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground text-lg">{vaccine.name}</h3>
                                                <p className="text-sm text-muted-foreground">{vaccine.manufacturer}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Doses Required</span>
                                                <Badge variant="outline">{vaccine.dosesRequired} Doses</Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Availability</span>
                                                <Badge className={vaccine.available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                                                    {vaccine.available ? 'Available' : 'Unavailable'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <CheckCircle className="h-4 w-4 text-secondary" />
                                            <span>WHO Approved</span>
                                        </div>

                                        <Button className="w-full bg-gradient-to-r from-secondary to-primary" disabled={!vaccine.available} asChild>
                                            <Link to="/patient/search-hospital">
                                                Book Vaccination
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Syringe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Vaccines Found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Try adjusting your search terms.' : 'No vaccines are currently available.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Need Help Choosing?</h2>
                        <p className="text-muted-foreground mb-6">
                            Our medical experts can help you choose the right vaccine based on your health conditions and requirements.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild>
                                <Link to="/patient/register">Register Now</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="tel:1800-123-4567">Call Helpline</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Vaccines;
