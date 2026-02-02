import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const categoryLabels = {
  poradniki: 'Poradniki',
  realizacje: 'Realizacje',
  nowosci: 'Nowości',
  technologie: 'Technologie',
  branza: 'Branża'
};

const categoryColors = {
  poradniki: 'bg-blue-100 text-blue-800',
  realizacje: 'bg-green-100 text-green-800',
  nowosci: 'bg-purple-100 text-purple-800',
  technologie: 'bg-orange-100 text-orange-800',
  branza: 'bg-gray-100 text-gray-800'
};

export default function BlogCard({ post, featured = false }) {
  const formattedDate = post.publish_date 
    ? format(new Date(post.publish_date), 'd MMMM yyyy', { locale: pl })
    : '';

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-gray-900">
        <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-full min-h-[300px]">
              {post.cover_image ? (
                <img 
                  src={post.cover_image || post.featured_image || "/placeholder-image.jpg"} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Błąd ładowania obrazu:", post.cover_image);
                    e.target.src = "https://placehold.co/600x400?text=Brak+Zdjecia"; // Obrazek zastępczy
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a84b] to-[#e6007e]" />
              )}
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <Badge className={`w-fit mb-4 ${categoryColors[post.category]}`}>
                {categoryLabels[post.category]}
              </Badge>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#d4a84b] transition-colors">
                {post.title}
              </h2>
              <p className="text-white/70 mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.read_time} min czytania
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-2 text-[#d4a84b] font-medium group-hover:gap-3 transition-all">
                Czytaj więcej <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
        <div className="relative h-48 overflow-hidden">
          {post.cover_image ? (
            <img 
              src={post.cover_image || post.featured_image || "/placeholder-image.jpg"} 
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Błąd ładowania obrazu:", post.cover_image);
                e.target.src = "https://placehold.co/600x400?text=Brak+Zdjecia"; // Obrazek zastępczy
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
          <Badge className={`absolute top-3 left-3 ${categoryColors[post.category]}`}>
            {categoryLabels[post.category]}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#e6007e] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.read_time} min
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}