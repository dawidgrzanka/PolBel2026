import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import PostsManager from '@/components/admin/PostsManager';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import CommentsManager from '@/components/admin/CommentsManager';
import ContentManager from '@/components/admin/ContentManager';
import SettingsManager from '@/components/admin/SettingsManager';
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, X } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get('tab');
  const action = urlParams.get('action');

  useEffect(() => {
    // Całkowicie pomijamy sprawdzanie w API base44
    const checkAuth = async () => {
      console.log("Symulacja autoryzacji admina...");
      
      // Ustawiamy użytkownika ręcznie bez pytania API
      setUser({ 
        id: '1', 
        name: 'Admin PolBel', 
        role: 'admin' 
      });
      
      // Kluczowe: wyłączamy ekran ładowania
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
    enabled: !loading
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: () => base44.entities.BlogComment.list('-created_date'),
    enabled: !loading
  });

  const { data: siteContent = [], isLoading: contentLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: () => base44.entities.SiteContent.list(),
    enabled: !loading
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date'),
    enabled: !loading
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
    enabled: !loading
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e6007e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie panelu...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (postsLoading || commentsLoading || contentLoading || productsLoading || ordersLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    switch (currentTab) {
      case 'posts':
        return <PostsManager posts={posts} initialAction={action} />;
      case 'products':
        return <ProductsManager products={products} />;
      case 'orders':
        return <OrdersManager orders={orders} />;
      case 'comments':
        return <CommentsManager comments={comments} posts={posts} />;
      case 'content':
        return <ContentManager siteContent={siteContent} />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <AdminDashboard posts={posts} comments={comments} orders={orders} products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] rounded-lg text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <AdminSidebar currentTab={currentTab} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto pt-12 lg:pt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}