import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

export default function AddAdminForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.registerAdmin(formData);
      toast.success('Dodano nowego administratora!');
      setFormData({ name: '', email: '', password: '' }); // Reset pola
    } catch (err) {
      toast.error(err.message || 'Błąd podczas dodawania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4">Dodaj nowego administratora</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Imię i nazwisko" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input 
          type="email" 
          placeholder="Adres e-mail" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
        <Input 
          type="password" 
          placeholder="Hasło" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          required
        />
        <Button 
          type="submit" 
          className="w-full bg-black text-white" 
          disabled={loading}
        >
          {loading ? 'Dodawanie...' : 'Utwórz konto'}
        </Button>
      </form>
    </div>
  );
}