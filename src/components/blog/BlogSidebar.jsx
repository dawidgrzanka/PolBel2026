import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Tag, FolderOpen, TrendingUp } from 'lucide-react';

const categoryLabels = {
  poradniki: 'Poradniki',
  realizacje: 'Realizacje',
  nowosci: 'Nowości',
  technologie: 'Technologie',
  branza: 'Branża'
};

export default function BlogSidebar({ posts, currentCategory, currentTag }) {
  // Get unique tags from all posts
  const allTags = [...new Set(posts.flatMap(p => p.tags || []))];
  
  // Get category counts
  const categoryCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  // Get popular posts (by views)
  const popularPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[#d4a84b]" />
          Kategorie
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              to={createPageUrl('Blog')}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                !currentCategory ? 'bg-[#e6007e]/10 text-[#e6007e]' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>Wszystkie</span>
              <Badge variant="secondary" className="text-xs">{posts.length}</Badge>
            </Link>
          </li>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <li key={key}>
              <Link
                to={createPageUrl(`Blog?category=${key}`)}
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                  currentCategory === key ? 'bg-[#e6007e]/10 text-[#e6007e]' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{label}</span>
                <Badge variant="secondary" className="text-xs">{categoryCounts[key] || 0}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#d4a84b]" />
            Tagi
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Link
                key={tag}
                to={createPageUrl(`Blog?tag=${tag}`)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  currentTag === tag 
                    ? 'bg-[#e6007e] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#d4a84b]" />
            Popularne
          </h3>
          <ul className="space-y-4">
            {popularPosts.map((post, index) => (
              <li key={post.id}>
                <Link
                  to={createPageUrl(`BlogPost?slug=${post.slug}`)}
                  className="flex gap-3 group"
                >
                  <span className="text-2xl font-bold text-gray-200 group-hover:text-[#d4a84b] transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-[#e6007e] transition-colors line-clamp-2">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}