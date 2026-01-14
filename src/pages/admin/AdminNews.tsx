import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Newspaper,
    Plus,
    Pencil,
    Trash2,
    Search,
    Calendar,
    Eye,
    EyeOff,
    Sparkles,
    Loader2,
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments, NewsArticle } from '@/contexts/AppointmentContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const categories = ['Health Alert', 'Achievement', 'Guide', 'Announcement', 'General'];

const AdminNews = () => {
    const { role } = useAuth();
    const { toast } = useToast();
    const { news, addNews, updateNews, deleteNews, refreshNews } = useAppointments();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'General',
        published: true
    });

    useEffect(() => {
        refreshNews();
    }, []);

    if (role !== 'admin') return <Navigate to="/admin/login" replace />;

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenDialog = (article?: NewsArticle) => {
        if (article) {
            setEditingNews(article);
            setFormData({
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                image: article.image,
                category: article.category,
                published: article.published
            });
        } else {
            setEditingNews(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                category: 'General',
                published: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.excerpt || !formData.content) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(true);
        try {
            if (editingNews) {
                await updateNews(editingNews.id, formData);
                toast({
                    title: 'News Updated',
                    description: 'The article has been updated successfully.'
                });
            } else {
                await addNews(formData);
                toast({
                    title: 'News Created',
                    description: 'The article has been created successfully.'
                });
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save the article. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNews(id);
            toast({
                title: 'News Deleted',
                description: 'The article has been deleted successfully.'
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete the article.',
                variant: 'destructive'
            });
        }
    };

    const togglePublished = async (article: NewsArticle) => {
        try {
            await updateNews(article.id, { published: !article.published });
            toast({
                title: article.published ? 'Article Unpublished' : 'Article Published',
                description: `The article is now ${article.published ? 'hidden from' : 'visible on'} the public news page.`
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update publish status.',
                variant: 'destructive'
            });
        }
    };

    const handleGenerateContent = async () => {
        if (!formData.title) {
            toast({
                title: 'Title Required',
                description: 'Please enter a title before generating content.',
                variant: 'destructive'
            });
            return;
        }

        setIsGenerating(true);
        try {
            const response = await api.post('/ai/generate-news-content', {
                title: formData.title,
                category: formData.category,
                details: formData.excerpt || undefined
            });

            if (response.data.success) {
                setFormData(prev => ({
                    ...prev,
                    content: response.data.data.content
                }));
                toast({
                    title: 'Content Generated',
                    description: 'AI has generated content for your article.'
                });
            }
        } catch (error) {
            toast({
                title: 'Generation Failed',
                description: 'Failed to generate content. Please try again or write manually.',
                variant: 'destructive'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const insertFormatting = (format: string) => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        let newText = '';

        switch (format) {
            case 'bold':
                newText = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                newText = `*${selectedText || 'italic text'}*`;
                break;
            case 'heading':
                newText = `\n## ${selectedText || 'Heading'}\n`;
                break;
            case 'list':
                newText = `\n- ${selectedText || 'List item'}\n`;
                break;
            case 'numbered':
                newText = `\n1. ${selectedText || 'List item'}\n`;
                break;
            default:
                return;
        }

        const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));
    };

    return (
        <DashboardLayout title="News Management" subtitle="Create and manage news articles">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search news..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-gradient-to-r from-primary to-secondary"
                            onClick={() => handleOpenDialog()}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add News Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingNews ? 'Edit News Article' : 'Create News Article'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingNews ? 'Update the article details below.' : 'Fill in the details to create a new article.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter article title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary of the article"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="content">Content *</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateContent}
                                        disabled={isGenerating || !formData.title}
                                        className="gap-2"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        )}
                                        {isGenerating ? 'Generating...' : 'AI Generate'}
                                    </Button>
                                </div>
                                {/* Formatting Toolbar */}
                                <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-t-md border border-b-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertFormatting('bold')}
                                        title="Bold"
                                    >
                                        <Bold className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertFormatting('italic')}
                                        title="Italic"
                                    >
                                        <Italic className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertFormatting('heading')}
                                        title="Heading"
                                    >
                                        <Heading2 className="h-4 w-4" />
                                    </Button>
                                    <div className="w-px h-6 bg-border mx-1" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertFormatting('list')}
                                        title="Bullet List"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => insertFormatting('numbered')}
                                        title="Numbered List"
                                    >
                                        <ListOrdered className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Full article content (supports markdown formatting)"
                                    rows={8}
                                    className="rounded-t-none font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tip: Use **bold**, *italic*, ## Heading, - list items
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={formData.published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                                />
                                <Label>Publish immediately</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingNews ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Newspaper className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{news.length}</p>
                                <p className="text-sm text-muted-foreground">Total Articles</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                                <Eye className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{news.filter(n => n.published).length}</p>
                                <p className="text-sm text-muted-foreground">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100">
                                <EyeOff className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{news.filter(n => !n.published).length}</p>
                                <p className="text-sm text-muted-foreground">Drafts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* News List */}
            <div className="grid gap-4">
                {filteredNews.length > 0 ? filteredNews.map(article => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {article.image && (
                                    <div className="md:w-48 h-32 md:h-auto overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant={article.published ? 'default' : 'secondary'}>
                                                    {article.published ? 'Published' : 'Draft'}
                                                </Badge>
                                                <Badge variant="outline">{article.category}</Badge>
                                            </div>
                                            <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => togglePublished(article)}
                                                title={article.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {article.published ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(article)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(article.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No news articles found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminNews;
