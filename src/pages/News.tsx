import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/ui/loading-spinner';
import { Syringe, Newspaper, Search, ArrowRight, Calendar, Moon, Sun, Menu, X } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';

const News = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDark, setIsDark] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { news } = useAppointments();
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

    const filteredNews = news.filter(n =>
        n.published && (
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            <Newspaper className="w-3 h-3 mr-1" /> Latest Updates
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            <span className="text-primary">News</span> & Articles
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            Stay informed with the latest COVID-19 news, health tips, and vaccination updates from trusted sources.
                        </p>

                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search news..."
                                className="pl-10 bg-card"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {filteredNews.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((article, index) => (
                                <Link to={`/news/${article.id}`} key={article.id}>
                                    <Card className="overflow-hidden hover-lift group cursor-pointer h-full animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={article.image || 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400'}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                                                {article.category}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                                <Calendar className="h-4 w-4" />
                                                <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                            </div>
                                            <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
                                            <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                                                Read More <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No News Found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Try adjusting your search terms.' : 'No news articles are currently available.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Subscribe Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
                        <p className="text-muted-foreground mb-6">
                            Get the latest COVID-19 news and updates delivered directly to your inbox.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
                            <Input placeholder="Enter your email" className="flex-1" />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default News;
