import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Save, ArrowLeft, Package } from 'lucide-react';
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
  image: '',
  in_stock: true,
  featured: false
};

export default function ProductsManager({ products }) {
  const [view, setView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt został dodany');
      setView('list');
      setEditingProduct(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt został zaktualizowany');
      setView('list');
      setEditingProduct(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt został usunięty');
      setDeleteProductId(null);
    }
  });

  const handleSave = () => {
    if (!editingProduct.name || !editingProduct.price) {
      toast.error('Wypełnij nazwę i cenę produktu');
      return;
    }

    const slug = editingProduct.slug || editingProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productData = { ...editingProduct, slug, price: Number(editingProduct.price) };

    if (editingProduct.id) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'editor') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setView('list'); setEditingProduct(null); }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wróć do listy
          </Button>
          <Button onClick={handleSave} className="bg-[#e6007e] hover:bg-[#c70069]">
            <Save className="w-4 h-4 mr-2" />
            Zapisz
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input
              placeholder="Nazwa produktu"
              value={editingProduct?.name || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="text-xl font-bold h-14"
            />
            <Input
              placeholder="Krótki opis"
              value={editingProduct?.short_description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
            />
            <Textarea
              placeholder="Pełny opis (Markdown)"
              value={editingProduct?.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold">Cena</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Kwota (PLN)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Jednostka</label>
                  <Select
                    value={editingProduct?.price_unit}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, price_unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold">Kategoria</h3>
              <Select
                value={editingProduct?.category}
                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold">Zdjęcie</h3>
              <Input
                placeholder="URL zdjęcia"
                value={editingProduct?.image || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
              />
              {editingProduct?.image && (
                <img src={editingProduct.image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold">Opcje</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dostępny</span>
                <Switch
                  checked={editingProduct?.in_stock}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, in_stock: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wyróżniony</span>
                <Switch
                  checked={editingProduct?.featured}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, featured: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produkty</h1>
        <Button
          className="bg-[#e6007e] hover:bg-[#c70069]"
          onClick={() => { setEditingProduct(emptyProduct); setView('editor'); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy produkt
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Szukaj produktów..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Produkt</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Kategoria</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cena</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-[#d4a84b]">
                  {product.price?.toLocaleString('pl-PL')} PLN
                </td>
                <td className="px-6 py-4">
                  <Badge className={product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {product.in_stock ? 'Dostępny' : 'Niedostępny'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setView('editor'); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteProductId(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="text-center py-8 text-gray-500">Brak produktów</p>
        )}
      </div>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń produkt</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć ten produkt?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteMutation.mutate(deleteProductId)}>
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}