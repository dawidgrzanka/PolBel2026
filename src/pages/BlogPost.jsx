import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
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

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => base44.entities.BlogPost.filter({ slug, published: true })
  });

  const post = posts[0];

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blog-posts-related'],
    queryFn: () => base44.entities.BlogPost.filter({ published: true }, '-publish_date', 10),
    enabled: !!post
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => base44.entities.BlogComment.filter({ post_id: post.id }),
    enabled: !!post?.id
  });

  // Increment views
  const updateViewsMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.update(id, { views: (post?.views || 0) + 1 })
  });

  useEffect(() => {
    if (post?.id) {
      updateViewsMutation.mutate(post.id);
    }
  }, [post?.id]);

  // Related posts
  const relatedPosts = allPosts
    .filter(p => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-96 rounded-2xl mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artykuł nie znaleziony</h1>
            <Link to={createPageUrl('Blog')} className="text-[#e6007e] hover:underline">
              Wróć do bloga
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.publish_date 
    ? format(new Date(post.publish_date), 'd MMMM yyyy', { locale: pl })
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Article Header */}
        <article itemScope itemType="https://schema.org/BlogPosting">
          <header className="bg-[#1a1a1a] py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
                <Link to={createPageUrl('Home')} className="hover:text-white flex items-center gap-1">
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to={createPageUrl('Blog')} className="hover:text-white">Blog</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
              </nav>

              <Badge className="mb-4 bg-[#e6007e]">
                {categoryLabels[post.category]}
              </Badge>

              <h1 
                itemProp="headline"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p itemProp="description" className="text-lg text-white/70 mb-8 max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/60 text-sm">
                {post.author_name && (
                  <span itemProp="author" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author_name}
                  </span>
                )}
                <time itemProp="datePublished" dateTime={post.publish_date} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </time>
                {post.read_time && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.read_time} min czytania
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative -mt-8 mb-8 max-w-5xl mx-auto px-4">
              <img
                itemProp="image"
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          )}

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div 
              itemProp="articleBody"
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#e6007e] prose-strong:text-gray-900 prose-img:rounded-xl"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    to={createPageUrl(`Blog?tag=${tag}`)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ShareButtons url={currentUrl} title={post.title} />
              <Link
                to={createPageUrl('Blog')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e6007e] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do bloga
              </Link>
            </div>

            {/* Comments */}
            <CommentSection postId={post.id} comments={comments} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-100 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Podobne artykuły</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}