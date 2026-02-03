import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Trash2, UserPlus, ShieldCheck } from 'lucide-react';

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const fetchAdmins = async () => {
    try {
      const data = await base44.auth.listAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error("Nie udało się pobrać listy adminów");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await base44.auth.registerAdmin(newAdmin);
      toast.success('Dodano nowego administratora');
      setNewAdmin({ name: '', email: '', password: '' });
      fetchAdmins(); // Odśwież listę
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego administratora?")) return;
    try {
      await base44.auth.deleteAdmin(id);
      toast.success('Usunięto pomyślnie');
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      toast.error("Błąd podczas usuwania");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formularz dodawania */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-[#e6007e]" />
            <h2 className="text-xl font-bold">Nowy Administrator</h2>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input placeholder="Imię i Nazwisko" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required />
            <Input type="email" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required />
            <Input type="password" placeholder="Hasło" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
            <Button className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-6 rounded-xl font-bold">
              Utwórz konto dostępowe
            </Button>
          </form>
        </div>

        {/* Lista adminów */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold">Aktualny Zespół</h2>
          </div>
          <div className="space-y-4">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
                <button 
                  onClick={() => handleDelete(admin.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}