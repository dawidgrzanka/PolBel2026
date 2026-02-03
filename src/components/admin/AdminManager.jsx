import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Trash2, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  // Pobieranie listy administratorów
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await base44.auth.listAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      toast.error("Nie udało się pobrać listy administratorów");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Rejestracja nowego administratora
  const handleRegister = async (e) => {
    e.preventDefault();
    if (newAdmin.password.length < 6) {
      return toast.error("Hasło musi mieć co najmniej 6 znaków");
    }

    try {
      setIsSubmitting(true);
      await base44.auth.registerAdmin(newAdmin);
      toast.success('Nowy administrator został dodany');
      setNewAdmin({ name: '', email: '', password: '' });
      await fetchAdmins(); // Odświeżenie listy z serwera
    } catch (err) {
      toast.error(err.message || "Błąd podczas rejestracji");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Usuwanie administratora
  const handleDelete = async (id, email) => {
    // Proste zabezpieczenie przed usunięciem konta, na którym się pracuje (opcjonalne)
    // Jeśli masz dostęp do danych zalogowanego usera, możesz tu wstawić porównanie maili
    
    if (!window.confirm(`Czy na pewno chcesz usunąć administratora ${email}?`)) return;

    try {
      await base44.auth.deleteAdmin(id);
      toast.success('Administrator został usunięty');
      // Optymistyczna aktualizacja UI
      setAdmins(prev => prev.filter(admin => admin.id !== id));
    } catch (err) {
      toast.error("Błąd podczas usuwania administratora");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900">Zarządzanie Zespołem</h1>
        <p className="text-gray-500 text-sm">Zarządzaj dostępem do panelu administracyjnego PolBel.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Formularz dodawania */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-[#e6007e]">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-xl font-bold text-gray-900">Nowy Administrator</h2>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Imię i Nazwisko</label>
              <Input 
                placeholder="np. Jan Kowalski" 
                value={newAdmin.name} 
                onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adres E-mail</label>
              <Input 
                type="email" 
                placeholder="admin@polbel.pl" 
                value={newAdmin.email} 
                onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hasło dostępowe</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={newAdmin.password} 
                onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                required 
                minLength={6}
              />
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#e6007e] hover:bg-[#c4006b] text-white py-6 rounded-xl font-bold transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Utwórz konto administratora"
              )}
            </Button>
          </form>
        </div>

        {/* Lista adminów */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
          <div className="flex items-center gap-2 mb-6 text-green-600">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold text-gray-900">Aktywne Uprawnienia</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Pobieranie listy...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.length === 0 ? (
                <p className="text-center py-8 text-gray-400">Brak innych administratorów.</p>
              ) : (
                admins.map(admin => (
                  <div 
                    key={admin.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-[#e6007e]/20 transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{admin.name}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{admin.email}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(admin.id, admin.email)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                      title="Usuń dostęp"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}