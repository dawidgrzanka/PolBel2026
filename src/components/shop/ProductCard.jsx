import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Package } from 'lucide-react';

const categoryLabels = {
  materialy: 'Materiały',
  wynajem: 'Wynajem',
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

export default function ProductCard({ product, onAddToCart }) {
  // Obsługa pola zdjęcia zgodnie z bazą (main_image)
  const displayImage = product.main_image || product.image;
  
  // Bezpieczne formatowanie ceny
  const formattedPrice = typeof product.price === 'number' 
    ? product.price.toLocaleString('pl-PL') 
    : parseFloat(product.price || 0).toLocaleString('pl-PL');

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
      {/* Zdjęcie produktu */}
      <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)} className="block relative">
        <div className="relative h-56 overflow-hidden bg-gray-50">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <Package className="w-10 h-10 mb-2 opacity-20" />
              <span className="text-xs font-medium uppercase tracking-wider">Brak zdjęcia</span>
            </div>
          )}
          
          {/* Badge: Wyróżnione */}
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-[#e6007e] shadow-lg border-none">
              Polecane
            </Badge>
          )}

          {/* Overlay: Niedostępny */}
          {(!product.in_stock || product.in_stock === 0) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-bold px-4 py-1">
                Chwilowy brak
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      {/* Treść karty */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-gray-200 text-gray-500">
            {categoryLabels[product.category] || product.category}
          </Badge>
        </div>
        
        <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)}>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#e6007e] transition-colors line-clamp-2 min-h-[3rem] leading-tight text-lg">
            {product.name}
          </h3>
        </Link>
        
        {product.short_description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 italic">
            {product.short_description}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col mb-4">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Cena netto</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#d4a84b]">
                {formattedPrice}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                PLN / {unitLabels[product.price_unit] || product.price_unit}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={!product.in_stock || product.in_stock === 0}
              className="flex-1 bg-[#e6007e] hover:bg-[#c70069] rounded-xl shadow-md shadow-[#e6007e]/10 transition-all active:scale-95"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Dodaj
            </Button>
            <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)}>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-gray-200 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}