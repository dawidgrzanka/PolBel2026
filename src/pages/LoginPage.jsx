import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.login(email, password);
      toast.success('Zalogowano pomyślnie!');
      window.location.href = '/admin'; // Przekierowanie do panelu
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-gray-900 text-white p-8 text-center">
          <CardTitle className="text-2xl font-black">Panel Admina</CardTitle>
          <p className="text-gray-400 text-sm">Zaloguj się, aby zarządzać sklepem</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">E-mail</label>
              <Input 
                type="email" 
                placeholder="admin@polbel.pl" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-gray-100 h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Hasło</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-100 h-12"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-[#e6007e] hover:bg-[#c4006b] font-bold text-white transition-all"
              disabled={loading}
            >
              {loading ? "Logowanie..." : "Wejdź do panelu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}