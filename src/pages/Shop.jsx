import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import ProductCard from '@/components/shop/ProductCard';
import CartDrawer from '@/components/shop/CartDrawer';
import { useCart } from '@/components/shop/useCart';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Home, ChevronRight, SlidersHorizontal, AlertCircle } from 'lucide-react';

const categoryLabels = {
  materialy: 'Materiały budowlane',
  wynajem: 'Wynajem sprzętu',
  uslugi: 'Usługi',
  transport: 'Transport'
};

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Integracja z koszykiem
  const { cart, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, cartCount } = useCart();

  // 1. Pobieranie danych z Twojej bazy (Product)
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => base44.entities.Product.list()
  });

  // 2. Bezpieczne przygotowanie listy produktów (zabezpieczenie przed błędem 500)
  const products = useMemo(() => {
    return Array.isArray(apiResponse) ? apiResponse : [];
  }, [apiResponse]);

  // 3. Zaawansowane filtrowanie i sortowanie
  const filteredProducts = useMemo(() => {
    // Filtrujemy tylko produkty dostępne
    let result = products.filter(p => p.in_stock === true || p.in_stock === 1);

    // Filtr kategorii
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filtr wyszukiwarki
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.short_description?.toLowerCase().includes(query)
      );
    }

    // Logika sortowania
    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'pl'));
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Liczniki produktów w kategoriach dla Selecta
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  // Widok błędu
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-40 flex flex-col items-center justify-center px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Nie udało się załadować oferty</h2>
          <p className="text-gray-600 mb-6">Sprawdź połączenie z bazą danych (XAMPP).</p>
          <Button onClick={() => window.location.reload()}>Odśwież stronę</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Przycisk koszyka - Fixed */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#e6007e] hover:bg-[#c70069] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Otwórz koszyk"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#d4a84b] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center px-1 border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Komponent koszyka (Drawer) */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <main className="pt-20">
        {/* Sekcja Hero */}
        <section className="bg-[#1a1a1a] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" aria-label="Breadcrumb">
              <Link to={createPageUrl('Home')} className="hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" /> Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Sklep i Wynajem</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Oferta <span className="text-[#d4a84b]">POLBEL</span>
            </h1>
            <p className="text-white/70 max-w-2xl">
              Wynajem maszyn budowlanych, sprzedaż materiałów i profesjonalne usługi transportowe. 
              Wszystko w jednym miejscu.
            </p>
          </div>
        </section>

        {/* Pasek Filtrów - Przyklejony u góry */}
        <section className="bg-white border-b sticky top-16 sm:top-20 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Czego szukasz? (np. koparka, piasek...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Wszystkie kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie produkty ({products.length})</SelectItem>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label} ({categoryCounts[key] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sortuj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Polecane</SelectItem>
                    <SelectItem value="price_asc">Cena: od najniższej</SelectItem>
                    <SelectItem value="price_desc">Cena: od najwyższej</SelectItem>
                    <SelectItem value="name">Nazwa A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Siatka produktów */}
        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <p className="text-gray-500 text-lg mb-4">Brak produktów spełniających kryteria</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Wyczyść wszystkie filtry
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Dostępne produkty i usługi ({filteredProducts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}