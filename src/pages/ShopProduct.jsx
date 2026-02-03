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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, ChevronRight, ShoppingCart, Minus, Plus, Check, Truck, Shield, Phone, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const categoryLabels = {
  materialy: 'Materiały budowlane',
  wynajem: 'Wynajem sprzętu',
  uslugi: 'Usługi',
  transport: 'Transport'
};

const unitLabels = {
  szt: 'szt.',
  m2: 'm²',
  m3: 'm³',
  mb: 'mb',
  godz: 'godz.',
  dzień: 'dzień',
  usluga: 'usługa'
};

export default function ShopProduct() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { cart, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, cartCount } = useCart();

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  // 1. Pobieranie głównego produktu
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['shop-product', slug],
    queryFn: () => base44.entities.Product.get(slug), // Zmieniono z .filter na .get
    enabled: !!slug
  });

  // 2. Pobieranie powiązanych produktów (z tej samej kategorii)
  const { data: relatedData = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product.category, in_stock: true }),
    enabled: !!product
  });

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  // Logika zdjęć: main_image jako pierwsze, potem reszta z galerii
  const allImages = useMemo(() => {
    if (!product) return [];
    // Używamy main_image (zgodnie z bazą SQL) lub image (fallback)
    const main = product.main_image || product.image;
    const gallery = Array.isArray(product.gallery) ? product.gallery : [];
    return [main, ...gallery].filter(Boolean);
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-32">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-[500px] rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-40 text-center px-4">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nie został znaleziony</h1>
          <p className="text-gray-600 mb-8">Artykuł mógł zostać usunięty lub zmieniono jego adres.</p>
          <Link to={createPageUrl('Shop')}>
            <Button className="bg-[#e6007e]">Wróć do sklepu</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = relatedData
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Floating Cart Trigger */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#e6007e] hover:bg-[#c70069] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#d4a84b] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
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

      <main className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to={createPageUrl('Home')} className="hover:text-gray-900"><Home className="w-4 h-4" /></Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={createPageUrl('Shop')} className="hover:text-gray-900">Sklep</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#e6007e] font-medium">{categoryLabels[product.category]}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden border shadow-sm group">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-2 opacity-20" />
                    <span>Brak zdjęcia</span>
                  </div>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === i ? 'border-[#e6007e] ring-2 ring-[#e6007e]/20' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
              <div className="mb-6">
                <Badge variant="secondary" className="bg-[#d4a84b]/10 text-[#a8822d] hover:bg-[#d4a84b]/20 border-none px-3 py-1 mb-4">
                  {categoryLabels[product.category]}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-2 bg-white rounded-2xl border-2 border-[#d4a84b]/20 shadow-sm">
                    <span className="text-3xl font-black text-[#d4a84b]">
                      {Number(product.price).toLocaleString('pl-PL')}
                    </span>
                    <span className="text-gray-500 font-medium ml-2">
                      PLN / {unitLabels[product.price_unit] || product.price_unit}
                    </span>
                  </div>
                  {product.in_stock ? (
                    <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4 mr-1" /> Dostępny od ręki
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-bold">Obecnie niedostępny</span>
                  )}
                </div>

                {product.short_description && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-gray-200 pl-4">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Purchase Box */}
              {product.in_stock && (
                <div className="bg-white p-6 rounded-3xl border shadow-sm mb-8">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Wybierz ilość</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-white"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-white"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 h-14 bg-[#e6007e] hover:bg-[#c70069] text-white font-bold rounded-2xl shadow-lg shadow-[#e6007e]/20 transition-all hover:scale-[1.02]"
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Dodaj do zamówienia
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
                  <Truck className="w-5 h-5 text-[#d4a84b]" />
                  <span className="text-xs font-semibold text-gray-600">Szybki transport</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
                  <Shield className="w-5 h-5 text-[#d4a84b]" />
                  <span className="text-xs font-semibold text-gray-600">Pewna jakość</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
                  <Phone className="w-5 h-5 text-[#d4a84b]" />
                  <span className="text-xs font-semibold text-gray-600">Doradztwo</span>
                </div>
              </div>

              {/* Full Description */}
              {product.description && (
                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Specyfikacja i opis produktu</h3>
                  <div className="prose prose-pink max-w-none text-gray-600">
                    <ReactMarkdown>{product.description}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900">Mogą Cię zainteresować</h2>
                <Link to={createPageUrl('Shop')} className="text-[#e6007e] font-bold hover:underline">Zobacz wszystko</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}