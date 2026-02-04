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
import { useQuery } from '@tanstack/react-query';
import { polbelApi} from '@/api/apiClient';

export default function Blog() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category');
  const currentTag = urlParams.get('tag');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Pobieranie danych z backendu
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => polbelApi.entities.BlogPost.list(),
  });

  // 2. BEZPIECZNE PRZYPISANIE: Upewniamy się, że allPosts to zawsze tablica
  // Jeśli apiResponse nie jest tablicą (np. jest błędem 500), używamy pustej listy []
  const allPosts = useMemo(() => {
    return Array.isArray(apiResponse) ? apiResponse : [];
  }, [apiResponse]);

  // 3. Filtrowanie i logika wyświetlania
  const filteredPosts = useMemo(() => {
    // Tutaj używamy już bezpiecznej zmiennej allPosts
    let result = allPosts.filter(p => p.published === true || p.published === 1);
    
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
  }, [allPosts, currentCategory, currentTag, searchQuery]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const categoryLabels = {
    poradniki: 'Poradniki',
    realizacje: 'Realizacje',
    nowosci: 'Nowości',
    technologie: 'Technologie',
    branza: 'Branża'
  };

  // Jeśli jest błąd serwera, możemy wyświetlić komunikat zamiast białej strony
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-40 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Ups! Serwer ma przerwę technologiczną.</h2>
          <p className="text-gray-600 mt-2">Upewnij się, że MySQL w XAMPP jest włączony.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <section className="bg-[#1a1a1a] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to={createPageUrl('Home')} className="hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" /> Start
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Blog</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Blog <span className="text-[#e6007e]">POLBEL</span>
            </h1>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Szukaj artykułów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-80 rounded-2xl" />
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl">
                    <p className="text-gray-500 text-lg">Brak artykułów do wyświetlenia.</p>
                  </div>
                ) : (
                  <>
                    {featuredPost && <div className="mb-8"><BlogCard post={featuredPost} featured /></div>}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {regularPosts.map(post => <BlogCard key={post.id} post={post} />)}
                    </div>
                  </>
                )}
              </div>
              <div className="lg:col-span-1">
                <BlogSidebar 
                  posts={allPosts} 
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