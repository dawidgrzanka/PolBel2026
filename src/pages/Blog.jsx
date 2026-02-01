import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

// MOCK DANE - zastępują Base44
const MOCK_POSTS = [
  {
    id: 1,
    title: "Budowa podjazdu - krok po kroku",
    excerpt: "Kompletny poradnik jak zrobić trwały podjazd z kostki brukowej...",
    category: "poradniki",
    tags: ["kostka", "podjazd", "bruk"],
    publish_date: "2026-01-15",
    featured_image: "/api/placeholder/800/500"
  },
  {
    id: 2,
    title: "Najnowsze realizacje POLBEL 2026",
    excerpt: "Prezentujemy nasze flagowe projekty z tego roku...",
    category: "realizacje",
    tags: ["projekty", "budownictwo"],
    publish_date: "2026-01-20",
    featured_image: "/api/placeholder/800/500"
  },
  {
    id: 3,
    title: "Nowe technologie w budownictwie",
    excerpt: "Jak nowoczesne technologie zmieniają branżę...",
    category: "technologie",
    tags: ["technologia", "innowacje"],
    publish_date: "2026-01-10",
    featured_image: "/api/placeholder/800/500"
  }
];

export default function Blog() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category');
  const currentTag = urlParams.get('tag');
  const [searchQuery, setSearchQuery] = useState('');

  // Symulacja ładowania
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = useMemo(() => {
    let result = MOCK_POSTS;
    
    if (currentCategory) {
      result = result.filter(p => p.category === currentCategory);
    }
    
    if (currentTag) {
      result = result.filter(p => p.tags?.includes(currentTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [currentCategory, currentTag, searchQuery]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const categoryLabels = {
    poradniki: 'Poradniki',
    realizacje: 'Realizacje',
    nowosci: 'Nowości',
    technologie: 'Technologie',
    branza: 'Branża'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero - bez zmian */}
        <section className="bg-[#1a1a1a] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
              <Link to={createPageUrl('Home')} className="hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" />
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Blog</span>
              {currentCategory && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[#d4a84b]">{categoryLabels[currentCategory]}</span>
                </>
              )}
              {currentTag && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-[#d4a84b]">#{currentTag}</span>
                </>
              )}
            </nav>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Blog <span className="text-[#e6007e]">POLBEL</span>
            </h1>
            <p className="text-white/70 max-w-2xl mb-8">
              Poradniki, realizacje i aktualności ze świata budownictwa. 
              Dzielimy się wiedzą i doświadczeniem.
            </p>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Szukaj artykułów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Content - bez zmian */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-80 rounded-2xl" />
                    <div className="grid sm:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl">
                    <p className="text-gray-500 text-lg">Nie znaleziono artykułów</p>
                    <Link 
                      to={createPageUrl('Blog')} 
                      className="text-[#e6007e] hover:underline mt-2 inline-block"
                    >
                      Zobacz wszystkie artykuły
                    </Link>
                  </div>
                ) : (
                  <>
                    {featuredPost && (
                      <div className="mb-8">
                        <BlogCard post={featuredPost} featured />
                      </div>
                    )}
                    {regularPosts.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-6">
                        {regularPosts.map(post => (
                          <BlogCard key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="lg:col-span-1">
                <BlogSidebar 
                  posts={MOCK_POSTS} 
                  currentCategory={currentCategory}
                  currentTag={currentTag}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
