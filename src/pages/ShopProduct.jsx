import React, { useState } from 'react';
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
import { Home, ChevronRight, ShoppingCart, Minus, Plus, Check, Truck, Shield, Phone } from 'lucide-react';
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

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-product', slug],
    queryFn: () => base44.entities.Product.filter({ slug })
  });

  const product = products[0];

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product.category, in_stock: true }, '-created_date', 4),
    enabled: !!product
  });

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const allImages = product ? [product.image, ...(product.gallery || [])].filter(Boolean) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-96 rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produkt nie znaleziony</h1>
            <Link to={createPageUrl('Shop')} className="text-[#e6007e] hover:underline">
              Wróć do sklepu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to={createPageUrl('Home')} className="hover:text-gray-900 flex items-center gap-1">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={createPageUrl('Shop')} className="hover:text-gray-900">Sklep</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={createPageUrl(`Shop?category=${product.category}`)} className="hover:text-gray-900">
              {categoryLabels[product.category]}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                        selectedImage === i ? 'border-[#e6007e]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <Badge variant="outline" className="mb-3">
                {categoryLabels[product.category]}
              </Badge>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-[#d4a84b]">
                  {product.price.toLocaleString('pl-PL')}
                </span>
                <span className="text-gray-500 text-lg">
                  PLN / {unitLabels[product.price_unit] || product.price_unit}
                </span>
              </div>

              {product.in_stock ? (
                <Badge className="bg-green-100 text-green-700 mb-6">
                  <Check className="w-3 h-3 mr-1" /> Dostępny
                </Badge>
              ) : (
                <Badge variant="secondary" className="mb-6">Niedostępny</Badge>
              )}

              {product.short_description && (
                <p className="text-gray-600 mb-6">{product.short_description}</p>
              )}

              {/* Add to cart */}
              {product.in_stock && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-[#e6007e] hover:bg-[#c70069]"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Dodaj do koszyka
                  </Button>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl mb-8">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-[#d4a84b]" />
                  <p className="text-xs text-gray-600">Dostawa na terenie Podkarpacia</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-[#d4a84b]" />
                  <p className="text-xs text-gray-600">Gwarancja jakości</p>
                </div>
                <div className="text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2 text-[#d4a84b]" />
                  <p className="text-xs text-gray-600">Wsparcie techniczne</p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Opis</h3>
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Podobne produkty</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map(p => (
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