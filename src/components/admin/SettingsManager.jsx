import React, { useState, useEffect } from 'react';
import { polbelApi} from '@/api/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsManager() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await polbelApi.auth.me();
      setUser(currentUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Ładowanie...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>

      <div className="grid gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#d4a84b]" />
              Informacje o koncie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-[#e6007e] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.full_name || 'Brak nazwy'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Badge className="mt-2 bg-[#d4a84b]">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Szybkie linki</CardTitle>
            <CardDescription>Przydatne zasoby i dokumentacja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <a 
                href="/" 
                target="_blank"
                className="p-4 border border-gray-200 rounded-lg hover:border-[#e6007e] hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">Strona główna</p>
                <p className="text-sm text-gray-500">Zobacz stronę publiczną</p>
              </a>
              <a 
                href="/Blog" 
                target="_blank"
                className="p-4 border border-gray-200 rounded-lg hover:border-[#e6007e] hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">Blog</p>
                <p className="text-sm text-gray-500">Przeglądaj artykuły</p>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle>Pomoc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Artykuły:</strong> Twórz i zarządzaj wpisami na blogu. Możesz używać składni Markdown do formatowania treści.</p>
              <p><strong>Komentarze:</strong> Moderuj komentarze użytkowników. Nowe komentarze wymagają zatwierdzenia przed publikacją.</p>
              <p><strong>Treści strony:</strong> Edytuj teksty wyświetlane na stronie głównej bez konieczności modyfikacji kodu.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}