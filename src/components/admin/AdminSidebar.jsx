import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  Globe,
  LogOut,
  ChevronLeft,
  Package,
  ShoppingCart
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Admin' },
  { name: 'Artykuły', icon: FileText, page: 'Admin?tab=posts' },
  { name: 'Produkty', icon: Package, page: 'Admin?tab=products' },
  { name: 'Zamówienia', icon: ShoppingCart, page: 'Admin?tab=orders' },
  { name: 'Komentarze', icon: MessageSquare, page: 'Admin?tab=comments' },
  { name: 'Treści strony', icon: Globe, page: 'Admin?tab=content' },
  { name: 'Ustawienia', icon: Settings, page: 'Admin?tab=settings' },
];

export default function AdminSidebar({ currentTab }) {
  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/77fab3149_logo_web26.png" 
          alt="POLBEL" 
          className="h-8 w-auto"
        />
        <p className="text-white/50 text-xs mt-2">Panel Administracyjny</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.page.split('?tab=')[1] || 
                           (!currentTab && item.page === 'Admin');
            return (
              <li key={item.name}>
                <Link
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#e6007e] text-white' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to={createPageUrl('Home')}
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Wróć do strony
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}