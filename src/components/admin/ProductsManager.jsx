import React, { useState } from 'react';
import { polbelApi} from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Save, ArrowLeft, Package, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categoryLabels = {
  materialy: 'Materiały',
  wynajem: 'Wynajem',
  uslugi: 'Usługi',
  transport: 'Transport'
};

const unitOptions = [
  { value: 'szt', label: 'Sztuka' },
  { value: 'm2', label: 'm²' },
  { value: 'm3', label: 'm³' },
  { value: 'mb', label: 'Metr bieżący' },
  { value: 'godz', label: 'Godzina' },
  { value: 'dzień', label: 'Dzień' },
  { value: 'usluga', label: 'Usługa' },
];

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  price: 0,
  price_unit: 'szt',
  category: 'materialy',
  main_image: '',
  featured: false,
  in_stock: true,
  published: true,
  specs: ''
};

export default function ProductsManager({ products = [] }) {
  const [view, setView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Zmiany zostały zapisane');
      setView('list');
      setEditingProduct(null);
    },
    onError: () => toast.error('Wystąpił błąd podczas zapisywania')
  };

  const createMutation = useMutation({
    mutationFn: (data) => polbelApi.entities.Product.create(data),
    ...mutationOptions
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await polbelApi.entities.Product.update(id, data);
      return response;
    },
    ...mutationOptions
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => polbelApi.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt usunięty');
      setDeleteProductId(null);
    }
  });

  const handleSave = async () => {
    if (!editingProduct) return;

    const generatedSlug = editingProduct.slug || editingProduct.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const productData = { 
      ...editingProduct, 
      slug: generatedSlug, 
      price: Number(editingProduct.price) 
    };

    try {
      if (editingProduct.id) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: productData });
      } else {
        await createMutation.mutateAsync(productData);
      }
    } catch (e) {
      console.error("Szczegóły błędu:", e);
      // TO DODAŁEM: Wyświetli Ci na ekranie, co dokładnie mówi baza danych
      toast.error(`Błąd: ${e.message || 'Nieznany błąd serwera'}`);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // WIDOK EDYTORA
  if (view === 'editor') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm sticky top-0 z-10 border">
          <Button variant="ghost" onClick={() => { setView('list'); setEditingProduct(null); }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy
          </Button>
          <div className="flex gap-3">
             <Button onClick={handleSave} className="bg-[#e6007e] hover:bg-[#c70069] px-8 text-white">
              <Save className="w-4 h-4 mr-2" /> Zapisz produkt
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Informacje podstawowe</h3>
              <Input
                placeholder="Nazwa produktu (np. Koparka JCB 3CX)"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="text-lg font-bold h-12"
              />
              <Input
                placeholder="Krótki opis na listę produktów"
                value={editingProduct?.short_description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
              />
              <Textarea
                placeholder="Pełny opis produktu (technologie, zastosowanie...)"
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="min-h-[250px] leading-relaxed"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Parametry techniczne</h3>
              <Textarea
                placeholder="Wpisz specyfikację, np: Moc: 74 kW, Waga: 8135 kg"
                value={editingProduct?.specs || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, specs: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Cennik</h3>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500">Cena netto (PLN)</label>
                <Input
                  type="number"
                  value={editingProduct?.price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="font-bold text-xl text-[#d4a84b]"
                />
                <Select
                  value={editingProduct?.price_unit}
                  onValueChange={(v) => setEditingProduct({ ...editingProduct, price_unit: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Wybierz jednostkę" /></SelectTrigger>
                  <SelectContent>
                    {unitOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Kategoria i Zdjęcie</h3>
              <Select
                value={editingProduct?.category}
                onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="pt-2">
                <Input
                  placeholder="URL zdjęcia głównego"
                  value={editingProduct?.main_image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, main_image: e.target.value })}
                />
                {editingProduct?.main_image ? (
                  <img src={editingProduct.main_image} alt="Preview" className="w-full h-40 object-cover rounded-xl mt-3 border" />
                ) : (
                  <div className="w-full h-40 bg-gray-50 rounded-xl mt-3 border flex flex-col items-center justify-center text-gray-400 italic text-xs">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    Podgląd zdjęcia
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl text-white space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Widoczność</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Produkt dostępny</span>
                <Switch
                  checked={editingProduct?.in_stock}
                  onCheckedChange={(c) => setEditingProduct({ ...editingProduct, in_stock: c })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wyróżnij na głównej</span>
                <Switch
                  checked={editingProduct?.featured}
                  onCheckedChange={(c) => setEditingProduct({ ...editingProduct, featured: c })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WIDOK LISTY (DOMYŚLNY)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Katalog Produktów</h1>
          <p className="text-gray-500 text-sm">Zarządzaj ofertą materiałów i sprzętu</p>
        </div>
        <Button
          className="bg-[#e6007e] hover:bg-[#c70069] text-white rounded-xl h-12 px-6"
          onClick={() => { setEditingProduct(emptyProduct); setView('editor'); }}
        >
          <Plus className="w-5 h-5 mr-2" /> Dodaj nowy produkt
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#e6007e] transition-colors" />
        <Input
          placeholder="Szukaj po nazwie lub kategorii..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 bg-white rounded-2xl border-none shadow-sm focus-visible:ring-2 focus-visible:ring-[#e6007e]"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Produkt</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 hidden md:table-cell">Kategoria</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Cena netto</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border bg-gray-100 flex-shrink-0">
                      {product.main_image ? (
                        <img src={product.main_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-[#e6007e] transition-colors">{product.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                        {product.featured && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5 h-4 border-none">Wyróżniony</Badge>}
                        <span className={product.in_stock ? 'text-green-600' : 'text-red-500'}>
                          ● {product.in_stock ? 'Dostępny' : 'Niedostępny'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <Badge variant="outline" className="rounded-md font-medium">{categoryLabels[product.category]}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-gray-900">{Number(product.price).toLocaleString('pl-PL')} PLN</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">za {product.price_unit}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg" onClick={() => { setEditingProduct(product); setView('editor'); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 rounded-lg" onClick={() => setDeleteProductId(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">Potwierdź usunięcie</AlertDialogTitle>
            <AlertDialogDescription>
              Produkt zostanie trwale usunięty z katalogu. Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold" onClick={() => deleteMutation.mutate(deleteProductId)}>
              Tak, usuń produkt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}