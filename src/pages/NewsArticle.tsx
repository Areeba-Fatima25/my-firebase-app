import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Clock, BookOpen } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ShareButtons from '@/components/ui/share-buttons';
import { PageLoader } from '@/components/ui/loading-spinner';
import { useAppointments } from '@/contexts/AppointmentContext';

// Fallback static articles for when API data isn't available
const staticArticles = [
  {
    id: '1',
    title: 'New COVID-19 Variant: What You Need to Know',
    excerpt: 'Health experts are monitoring a new variant that has emerged. Here is everything you need to know about symptoms and prevention.',
    content: `
      <p>A new COVID-19 variant has been identified by health authorities worldwide. This article provides comprehensive information about what this means for public health and individual precautions.</p>
      
      <h2>Key Findings</h2>
      <p>The new variant, designated by the WHO, shows several mutations in the spike protein. Early data suggests it may have increased transmissibility compared to previous strains.</p>
      
      <h2>Symptoms to Watch For</h2>
      <ul>
        <li>High fever (above 38°C/100.4°F)</li>
        <li>Persistent dry cough</li>
        <li>Extreme fatigue</li>
        <li>Loss of taste or smell</li>
        <li>Difficulty breathing</li>
      </ul>
      
      <h2>Prevention Measures</h2>
      <p>The best protection remains vaccination. Current vaccines continue to provide significant protection against severe illness and hospitalization. Additional measures include:</p>
      <ul>
        <li>Wearing masks in crowded indoor spaces</li>
        <li>Regular hand washing</li>
        <li>Maintaining social distance when possible</li>
        <li>Getting booster shots when eligible</li>
      </ul>
      
      <h2>What Experts Say</h2>
      <p>"While we are closely monitoring this new variant, the public should not panic. The fundamentals of protection remain the same - get vaccinated, wear masks in high-risk settings, and practice good hygiene," says Dr. Sarah Chen, Chief Medical Officer.</p>
    `,
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800',
    category: 'Health Alert',
    author: 'Dr. Sarah Chen',
    date: '2026-01-02',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Vaccination Drive Reaches 1 Million Milestone',
    excerpt: 'Our vaccination program has successfully administered over 1 million doses, marking a significant achievement in public health.',
    content: `
      <p>We are proud to announce that our vaccination program has reached a historic milestone - 1 million doses administered across all participating hospitals and clinics.</p>
      
      <h2>The Journey</h2>
      <p>Starting from humble beginnings in early 2021, our network of healthcare providers has worked tirelessly to ensure vaccine accessibility for all citizens.</p>
      
      <h2>Impact on Community Health</h2>
      <p>Since the vaccination drive began:</p>
      <ul>
        <li>COVID-19 hospitalizations decreased by 78%</li>
        <li>ICU admissions reduced by 85%</li>
        <li>Community transmission rates dropped significantly</li>
        <li>Economic recovery accelerated in vaccinated regions</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>Our goal is to reach 2 million vaccinations by the end of this quarter. We are expanding our network of vaccination centers and introducing mobile vaccination units to reach underserved communities.</p>
      
      <h2>How You Can Help</h2>
      <p>If you haven't been vaccinated yet, schedule your appointment today. Encourage family and friends to get vaccinated. Together, we can end this pandemic.</p>
    `,
    image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=800',
    category: 'Achievement',
    author: 'Health Ministry',
    date: '2026-01-01',
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Understanding Booster Shots: Complete Guide',
    excerpt: 'Everything you need to know about COVID-19 booster shots, eligibility, and benefits for enhanced protection.',
    content: `
      <p>Booster shots have become an essential part of our COVID-19 protection strategy. This comprehensive guide answers all your questions about boosters.</p>
      
      <h2>Why Boosters Are Important</h2>
      <p>Studies show that vaccine protection can wane over time. Booster doses help restore and enhance immunity, providing stronger protection against severe illness.</p>
      
      <h2>Who Should Get a Booster?</h2>
      <ul>
        <li>Adults 18 and older (6 months after primary series)</li>
        <li>Immunocompromised individuals</li>
        <li>Healthcare workers and frontline staff</li>
        <li>People 65 and older (high priority)</li>
      </ul>
      
      <h2>Types of Boosters Available</h2>
      <p>Updated bivalent boosters target both the original virus and newer variants. Available options include:</p>
      <ul>
        <li>Pfizer-BioNTech Bivalent</li>
        <li>Moderna Bivalent</li>
        <li>Novavax (protein-based option)</li>
      </ul>
      
      <h2>Side Effects</h2>
      <p>Common side effects are similar to primary doses: sore arm, fatigue, mild fever. These typically resolve within 1-2 days and indicate your immune system is responding.</p>
      
      <h2>Book Your Booster</h2>
      <p>Visit our platform to find vaccination centers near you offering booster shots. Walk-ins are available at many locations.</p>
    `,
    image: 'https://images.unsplash.com/photo-1609601546183-5d8dd0dd8848?w=800',
    category: 'Guide',
    author: 'Dr. Michael Roberts',
    date: '2025-12-28',
    readTime: '6 min read'
  }
];

const NewsArticle = () => {
  const { articleId } = useParams();
  const { news, newsLoading } = useAppointments();

  // Combine API news with static articles, preferring API data
  const allArticles = news.length > 0 ? [...news, ...staticArticles] : staticArticles;

  // Find article by ID
  const article = allArticles.find(a => a.id === articleId);

  if (newsLoading) {
    return <PageLoader />;
  }

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  // Get related articles (excluding current)
  const relatedArticles = allArticles.filter(a => a.id !== articleId).slice(0, 2);
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8 animate-fade-in">
          <img
            src={article.image || 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            {article.category}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{(article as any).author || 'CovidCare Team'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{(article as any).readTime || '3 min read'}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {article.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
          dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt}</p>` }}
        />

        {/* Share */}
        <div className="flex items-center gap-4 py-6 border-t border-b border-border mb-12">
          <span className="font-medium text-foreground">Share this article:</span>
          <ShareButtons
            url={articleUrl}
            title={article.title}
            description={article.excerpt}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} to={`/news/${related.id}`}>
                  <Card className="overflow-hidden hover-lift group cursor-pointer">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={related.image || 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400'}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">{related.category}</Badge>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{(related as any).readTime || '3 min read'}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default NewsArticle;
