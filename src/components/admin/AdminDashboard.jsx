import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FileText, 
  MessageSquare, 
  Package, 
  ShoppingCart, 
  Plus, 
  TrendingUp, 
  Clock, 
  User 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function AdminDashboard({ posts = [], comments = [], orders = [], products = [] }) {
  // 1. Obliczenia statystyk (z zabezpieczeniem przed undefined)
  const publishedPosts = posts.filter(p => p.published);
  const pendingComments = comments.filter(c => !c.approved);
  const newOrders = orders.filter(o => o.status === 'nowe');
  
  // Obliczanie przychodu (uwzględniając polskie znaki w statusie z bazy)
  const totalRevenue = orders
    .filter(o => o.status === 'zakończone' || o.status === 'zakonczone')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // 2. Sortowanie danych do list (najnowsze u góry)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_date || b.publish_date) - new Date(a.created_date || a.publish_date))
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const stats = [
    { label: 'Nowe zamówienia', value: newOrders.length, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Produkty', value: products.length, icon: Package, color: 'bg-green-500' },
    { label: 'Oczekujące komentarze', value: pendingComments.length, icon: MessageSquare, color: 'bg-orange-500' },
    { label: 'Artykuły', value: publishedPosts.length, icon: FileText, color: 'bg-purple-500' },
  ];

  // Helper do formatowania daty, aby nie wywalało błędu przy pustej dacie
  const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    try {
      return format(new Date(dateStr), 'd MMM yyyy', { locale: pl });
    } catch (e) {
      return 'Błędna data';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">Witaj w panelu zarządzania Pol-Bud.</p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl('Admin?tab=products&action=new')}>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Produkt
            </Button>
          </Link>
          <Link to={createPageUrl('Admin?tab=posts&action=new')}>
            <Button className="bg-[#e6007e] hover:bg-[#c70069]" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Artykuł
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Orders Section */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-gray-50">
            <CardTitle className="text-lg font-bold">Ostatnie zamówienia</CardTitle>
            <Link to={createPageUrl('Admin?tab=orders')} className="text-xs font-bold text-[#e6007e] hover:underline">
              Pełna lista
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#d4a84b]">{Number(order.total).toLocaleString('pl-PL')} PLN</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      order.status === 'nowe' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="p-10 text-center">
                  <ShoppingCart className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Brak zamówień do wyświetlenia</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts Section */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-gray-50">
            <CardTitle className="text-lg font-bold">Ostatnie artykuły</CardTitle>
            <Link to={createPageUrl('Admin?tab=posts')} className="text-xs font-bold text-[#e6007e] hover:underline">
              Zarządzaj blogiem
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentPosts.map(post => (
                <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-bold text-sm text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-500 italic">
                      {formatDate(post.publish_date || post.created_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                      post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.published ? 'Live' : 'Szkic'}
                    </span>
                  </div>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="p-10 text-center">
                  <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Brak artykułów</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}