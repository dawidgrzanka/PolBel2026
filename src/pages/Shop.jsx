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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Home, ChevronRight, SlidersHorizontal } from 'lucide-react';

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

  const { cart, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, cartCount } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => base44.entities.Product.filter({ in_stock: true })
  });

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.short_description?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'pl'));
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Cart Button - Fixed */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#e6007e] hover:bg-[#c70069] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#d4a84b] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#1a1a1a] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to={createPageUrl('Home')} className="hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" />
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Sklep</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Sklep <span className="text-[#d4a84b]">POLBEL</span>
            </h1>
            <p className="text-white/70 max-w-2xl">
              Materiały budowlane, wynajem sprzętu i profesjonalne usługi. 
              Wszystko czego potrzebujesz do realizacji projektu.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b sticky top-16 sm:top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Szukaj produktów..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie ({products.length})</SelectItem>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label} ({categoryCounts[key] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sortuj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Wyróżnione</SelectItem>
                    <SelectItem value="price_asc">Cena: rosnąco</SelectItem>
                    <SelectItem value="price_desc">Cena: malejąco</SelectItem>
                    <SelectItem value="name">Nazwa A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Nie znaleziono produktów</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Wyczyść filtry
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Znaleziono {filteredProducts.length} produktów
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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