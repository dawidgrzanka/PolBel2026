import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import BlogCard from '@/components/blog/BlogCard';
import ShareButtons from '@/components/blog/ShareButtons';
import CommentSection from '@/components/blog/CommentSection';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ChevronRight, Home, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const categoryLabels = {
  poradniki: 'Poradniki',
  realizacje: 'Realizacje',
  nowosci: 'Nowości',
  technologie: 'Technologie',
  branza: 'Branża'
};

const BlogPostPage = () => {
  const location = useLocation();
  
  // 1. Pobieramy slug z parametrów URL (?slug=twoj-post)
  const urlParams = new URLSearchParams(location.search);
  const currentSlug = urlParams.get('slug');

  // 2. Pobieramy wszystkie posty z bazy
  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => base44.entities.BlogPost.list(),
  });

  // 3. Znajdujemy ten konkretny post na podstawie sluga
  const post = useMemo(() => {
    return allPosts.find(p => p.slug === currentSlug);
  }, [allPosts, currentSlug]);

  // 4. Wybieramy podobne artykuły (te same kategorie, ale nie ten sam post)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(p => p.category === post.category && p.id !== post.id && (p.published === true || p.published === 1))
      .slice(0, 3);
  }, [allPosts, post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Nie znaleziono artykułu</h1>
          <Link to="/blog" className="text-[#e6007e] hover:underline">Wróć do bloga</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 py-4 pt-24">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#e6007e] flex items-center gap-1">
            <Home size={16} /> Start
          </Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-[#e6007e]">Blog</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-gray-900 truncate">{post.title}</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <article className="lg:col-span-8">
            <header className="mb-8">
              <Badge className="mb-4 bg-[#e6007e]/10 text-[#e6007e] border-none px-3 py-1">
                {categoryLabels[post.category] || post.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#e6007e]" />
                  <span className="font-medium text-gray-700">{post.author_name || 'Zespół PolBel'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {post.publish_date ? format(new Date(post.publish_date), 'd MMMM yyyy', { locale: pl }) : ''}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  {post.read_time || 5} min czytania
                </div>
              </div>

              {post.cover_image && (
                <img 
                  src={post.cover_image || post.featured_image || "/placeholder-image.jpg"} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Błąd ładowania obrazu:", post.cover_image);
                    e.target.src = "https://placehold.co/600x400?text=Brak+Zdjecia"; // Obrazek zastępczy
                  }}
                />
              )}
            </header>

            <div className="prose prose-pink prose-lg max-w-none mb-12">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags & Share */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-t border-b border-gray-100 mb-12">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(post.tags) && post.tags.map(tag => (
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
            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Potrzebujesz wyceny?</h3>
              <p className="mb-6 opacity-90 text-gray-300">Realizujemy profesjonalne prace ziemne i wynajem sprzętu na terenie całego województwa.</p>
              <Link 
                to="/kontakt" 
                className="inline-block bg-[#e6007e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#c70069] transition-colors w-full text-center"
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
                    to={`/blog?category=${key}`}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-[#e6007e]">{label}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Podobne artykuły */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-6">Podobne artykuły</h3>
                <div className="space-y-6">
                  {relatedPosts.map(rel => (
                    <Link key={rel.id} to={createPageUrl(`BlogPost?slug=${rel.slug}`)} className="flex gap-4 group">
                      <img 
                        src={post.cover_image || post.featured_image || "/placeholder-image.jpg"} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Błąd ładowania obrazu:", post.cover_image);
                          e.target.src = "https://placehold.co/600x400?text=Brak+Zdjecia"; // Obrazek zastępczy
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#e6007e] line-clamp-2 transition-colors">
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
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;