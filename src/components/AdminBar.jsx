import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { polbelApi} from '@/api/apiClient';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

export default function AdminBar() {
  // Sprawdzamy, czy admin jest zalogowany (token w localStorage)
  const isAuthenticated = polbelApi.auth.isAuthenticated();
  
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    polbelApi.auth.logout();
    window.location.reload(); // Odświeżamy stronę główną po wylogowaniu
  };

  return (
    <div className="bg-[#1a1a1a] text-white h-10 flex items-center justify-between px-4 sticky top-0 z-[9999] border-b border-white/10 text-xs">
      <div className="flex items-center gap-6">
        <Link 
          to={createPageUrl('Admin')} 
          className="flex items-center gap-2 hover:text-[#e6007e] transition-colors font-bold"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          PANEL ADMINA
        </Link>
        
        <div className="hidden md:flex items-center gap-2 text-white/50">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Tryb edycji aktywny
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/10">
          <User className="w-3 h-3 text-[#e6007e]" />
          <span className="font-medium">Administrator</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Wyloguj
        </button>
      </div>
    </div>
  );
}