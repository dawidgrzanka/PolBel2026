import React from 'react';
import { Link } from 'react-router-dom';
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
  ShoppingCart,
  Users 
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Admin' },
  { name: 'Artykuły', icon: FileText, page: 'Admin?tab=posts' },
  { name: 'Produkty', icon: Package, page: 'Admin?tab=products' },
  { name: 'Zamówienia', icon: ShoppingCart, page: 'Admin?tab=orders' },
  { name: 'Użytkownicy', icon: Users, page: 'Admin?tab=users' },
  { name: 'Komentarze', icon: MessageSquare, page: 'Admin?tab=comments' },
  { name: 'Treści strony', icon: Globe, page: 'Admin?tab=content' },
  { name: 'Ustawienia', icon: Settings, page: 'Admin?tab=settings' },
];

export default function AdminSidebar({ currentTab, user }) {
  const handleLogout = () => {
    base44.auth.logout();
  };

  // Funkcja generująca inicjały z nazwy użytkownika
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] min-h-screen flex flex-col fixed left-0 top-0 border-r border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/77fab3149_logo_web26.png" 
          alt="POLBEL" 
          className="h-8 w-auto"
        />
        <p className="text-white/50 text-[10px] mt-2 uppercase tracking-widest font-bold">Panel Administracyjny</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const itemTab = item.page.split('?tab=')[1];
            const isActive = (!currentTab && !itemTab) || currentTab === itemTab;
            
            return (
              <li key={item.name}>
                <Link
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#e6007e] text-white shadow-lg shadow-[#e6007e]/20' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-black/40">
        
        {/* Profil zalogowanego użytkownika */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
            <div className="w-9 h-9 rounded-lg bg-[#e6007e] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#e6007e]/30 shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-bold text-sm truncate">{user.name}</span>
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">Zalogowany</span>
            </div>
          </div>
        )}

        <Link
          to={createPageUrl('Home')}
          className="flex items-center gap-3 px-4 py-2 text-white/50 hover:text-white transition-colors text-sm group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Wróć do strony
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-white/50 hover:text-red-400 transition-colors w-full text-left text-sm"
        >
          <LogOut className="w-4 h-4" />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}