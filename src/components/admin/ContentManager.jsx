import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Globe, Phone, MapPin, Mail } from 'lucide-react';
import { toast } from 'sonner';

const defaultContent = {
  // Hero Section
  hero_title: 'BUDUJEMY SOLIDNOŚĆ.',
  hero_subtitle: 'Kompleksowe Realizacje Ziemne, Brukarskie i Instalacyjne',
  hero_cta_primary: 'UMÓW KONSULTACJĘ',
  hero_cta_secondary: 'WYPOŻYCZ SPRZĘT',
  
  // Contact Info
  contact_phone: '+48 123 456 789',
  contact_email: 'kontakt@polbel.pl',
  contact_address: 'ul. Budowlana 15, 37-500 Jarosław, Polska',
  contact_hours: 'Pon-Pt: 7:00 - 17:00',
  
  // About
  company_description: 'Budujemy solidność od ponad 15 lat. Kompleksowe usługi budowlane, brukarskie i instalacyjne na terenie całego Podkarpacia.',
  
  // Stats
  stat_years: '15+',
  stat_area: '40+',
  stat_equipment: '100%',
};

export default function ContentManager({ siteContent }) {
  const [content, setContent] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const contentMap = {};
    siteContent.forEach(item => {
      contentMap[item.section_key] = item.value;
    });
    setContent({ ...defaultContent, ...contentMap });
  }, [siteContent]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteContent.create(data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SiteContent.update(id, data),
  });

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const promises = Object.entries(content).map(async ([key, value]) => {
      const existing = siteContent.find(c => c.section_key === key);
      if (existing) {
        return updateMutation.mutateAsync({ id: existing.id, data: { value } });
      } else {
        return createMutation.mutateAsync({ 
          section_key: key, 
          value, 
          content_type: 'text',
          page: 'global' 
        });
      }
    });

    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: ['admin-content'] });
    toast.success('Treści zostały zapisane');
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Treści strony</h1>
        <Button 
          onClick={handleSave} 
          className="bg-[#e6007e] hover:bg-[#c70069]"
          disabled={!hasChanges}
        >
          <Save className="w-4 h-4 mr-2" />
          Zapisz zmiany
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Sekcja Hero</TabsTrigger>
          <TabsTrigger value="contact">Dane kontaktowe</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
          <TabsTrigger value="about">O firmie</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#d4a84b]" />
                Sekcja Hero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tytuł główny</label>
                <Input
                  value={content.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="text-lg font-bold"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Podtytuł</label>
                <Input
                  value={content.hero_subtitle || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Przycisk główny</label>
                  <Input
                    value={content.hero_cta_primary || ''}
                    onChange={(e) => handleChange('hero_cta_primary', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Przycisk dodatkowy</label>
                  <Input
                    value={content.hero_cta_secondary || ''}
                    onChange={(e) => handleChange('hero_cta_secondary', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#d4a84b]" />
                Dane kontaktowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Telefon
                  </label>
                  <Input
                    value={content.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <Input
                    value={content.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Adres
                </label>
                <Input
                  value={content.contact_address || ''}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Godziny pracy</label>
                <Input
                  value={content.contact_hours || ''}
                  onChange={(e) => handleChange('contact_hours', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statystyki w sekcji Hero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Lata doświadczenia</label>
                  <Input
                    value={content.stat_years || ''}
                    onChange={(e) => handleChange('stat_years', e.target.value)}
                    placeholder="15+"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Obszar działania (km)</label>
                  <Input
                    value={content.stat_area || ''}
                    onChange={(e) => handleChange('stat_area', e.target.value)}
                    placeholder="40+"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Własny sprzęt</label>
                  <Input
                    value={content.stat_equipment || ''}
                    onChange={(e) => handleChange('stat_equipment', e.target.value)}
                    placeholder="100%"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>O firmie</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Opis firmy (stopka)</label>
                <Textarea
                  value={content.company_description || ''}
                  onChange={(e) => handleChange('company_description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}