import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import BlogCard from '@/components/blog/BlogCard';
import ShareButtons from '@/components/blog/ShareButtons';
import CommentSection from '@/components/blog/CommentSection';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ChevronRight, Home, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const categoryLabels = {
  poradniki: 'Poradniki',
  realizacje: 'Realizacje',
  nowosci: 'Nowości',
  technologie: 'Technologie',
  branza: 'Branża'
};

// MOCK POST (zastępuje Base44)
const MOCK_POST = {
  id: 1,
  title: "Budowa podjazdu - krok po kroku",
  slug: "budowa-podzaju-krok-po-kroku",
  excerpt: "Kompletny poradnik jak zrobić trwały podjazd z kostki brukowej, betonu lub grysu. Wszystkie kroki z zdjęciami i materiałami.",
  category: "poradniki",
  tags: ["kostka", "podjazd", "bruk", "beton"],
  author_name: "Zespół POLBEL",
  publish_date: "2026-01-15",
  read_time: 8,
  views: 127,
  cover_image: "/api/placeholder/1200/600",
  content: `
## Przygotowanie terenu

1. **Wybierz odpowiednie miejsce** - podjazd powinien mieć nachylenie max 5%
2. **Usuń darń i korzenie** - głębokość wykopu 25-30 cm
3. **Wyrównaj podłoże** - użyj niwelatora laserowego

## Warstwy podbudowy

### 1. Warstwa nośna (15 cm)
- Kruszywo 0/31.5 mm
- Ubicie wibroplate m 98%

### 2. Warstwa wiążąca (10 cm)
- Kruszywo 0/16 mm
- Ubicie do 100%

## Układanie kostki brukowej

**Materiały potrzebne:**
- Kostka granitowa lub betonowa
- Piasek kwarcowy 0/2 mm
- Crossy gumowe
- Niweleta

**Koszt przykładowy (100m²):**
| Pozycja | Cena |
|---------|------|
| Kostka granit 4cm | 120 zł/m² |
| Piasek + kruszywo | 25 zł/m² |
| Robocizna | 40 zł/m² |
**RAZEM: 185 zł/m²**

> **Uwaga:** Ceny orientacyjne 2026r. Zapytaj o wycenę!
  `
};

const MOCK_RELATED_POSTS = [
  {
    id: 2,
    title: "Montaż odwodnienia liniowego",
    excerpt: "Jak poprawnie zamontować wpusty i korytka...",
    category: "poradniki",
    tags: ["odwodnienie", "korytka"],
    publish_date: "2026-01-20",
    featured_image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Nowości w ofercie POLBEL 2026",
    excerpt: "Prezentujemy nowe usługi i sprzęt...",
    category: "nowosci",
    Jasne, chętnie pomogę Ci dokończyć ten komponent. Wygląda na to, że budujesz szczegółowy widok posta blogowego w React.

Dokończyłem tablicę MOCK_RELATED_POSTS, dodałem logikę stanu (loading/post) oraz strukturę JSX, która wykorzystuje Twoje importy (Breadcrumbs, Sidebar z kategoriami, renderowanie Markdown i sekcje powiązanych wpisów).

Oto kompletny kod od miejsca, w którym przerwałeś:

JavaScript
    tags: ["polbel", "rozwój"],
    publish_date: "2026-01-25",
    featured_image: "/api/placeholder/400/250"
  }
];

const BlogPostPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Symulacja pobierania danych
    const timer = setTimeout(() => {
      setPost(MOCK_POST);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
            <Home size={16} /> Start
          </Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-blue-600">Blog</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-900 truncate">{post.title}</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <article className="lg:col-span-8">
            <header className="mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">
                {categoryLabels[post.category]}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  <span className="font-medium text-gray-700">{post.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {format(new Date(post.publish_date), 'd MMMM yyyy', { locale: pl })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  {post.read_time} min czytania
                </div>
              </div>

              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-auto rounded-2xl shadow-lg mb-10"
              />
            </header>

            <div className="prose prose-blue prose-lg max-w-none mb-12">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags & Share */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-t border-b border-gray-100 mb-12">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    <Tag size={14} /> {tag}
                  </span>
                ))}
              </div>
              <ShareButtons url={window.location.href} title={post.title} />
            </div>

            <CommentSection postId={post.id} />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* O autorze / CTA */}
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Potrzebujesz wyceny?</h3>
              <p className="mb-6 opacity-90">Realizujemy profesjonalne podjazdy i prace ziemne na terenie całego województwa.</p>
              <Link 
                to="/kontakt" 
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Darmowa wycena
              </Link>
            </div>

            {/* Kategorie */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Kategorie
              </h3>
              <div className="space-y-2">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <Link 
                    key={key} 
                    to={`/blog/kategoria/${key}`}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-blue-600">{label}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Powiązane wpisy */}
            <div>
              <h3 className="text-xl font-bold mb-6">Podobne artykuły</h3>
              <div className="space-y-6">
                {MOCK_RELATED_POSTS.map(rel => (
                  <Link key={rel.id} to={`/blog/${rel.id}`} className="flex gap-4 group">
                    <img src={rel.featured_image} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" alt="" />
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                        {categoryLabels[rel.category]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;