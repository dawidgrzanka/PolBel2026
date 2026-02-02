import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, MessageSquare, Eye, TrendingUp, Plus, Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function AdminDashboard({ posts, comments, orders = [], products = [] }) {
  const publishedPosts = posts.filter(p => p.published);
  const pendingComments = comments.filter(c => !c.approved);
  const newOrders = orders.filter(o => o.status === 'nowe');
  const totalRevenue = orders.filter(o => o.status === 'zakonczone').reduce((sum, o) => sum + (o.total || 0), 0);
  
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  const stats = [
    { label: 'Nowe zamówienia', value: newOrders.length, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Produkty', value: products.length, icon: Package, color: 'bg-green-500' },
    { label: 'Oczekujące komentarze', value: pendingComments.length, icon: MessageSquare, color: 'bg-orange-500' },
    { label: 'Artykuły', value: publishedPosts.length, icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to={createPageUrl('Admin?tab=posts&action=new')}>
          <Button className="bg-[#e6007e] hover:bg-[#c70069]">
            <Plus className="w-4 h-4 mr-2" />
            Nowy artykuł
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ostatnie artykuły</CardTitle>
            <Link to={createPageUrl('Admin?tab=posts')} className="text-sm text-[#e6007e] hover:underline">
              Zobacz wszystkie
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-sm text-gray-500">
                      {post.publish_date && format(new Date(post.publish_date), 'd MMM yyyy', { locale: pl })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.published ? 'Opublikowany' : 'Szkic'}
                  </span>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <p className="text-gray-500 text-center py-4">Brak artykułów</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Oczekujące komentarze</CardTitle>
            <Link to={createPageUrl('Admin?tab=comments')} className="text-sm text-[#e6007e] hover:underline">
              Zobacz wszystkie
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingComments.slice(0, 5).map(comment => (
                <div key={comment.id} className="py-2 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-900">{comment.author_name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                </div>
              ))}
              {pendingComments.length === 0 && (
                <p className="text-gray-500 text-center py-4">Brak oczekujących komentarzy</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}