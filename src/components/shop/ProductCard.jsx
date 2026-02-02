import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from 'lucide-react';

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
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col">
      <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)} className="block relative">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-4xl">📦</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-[#e6007e]">Wyróżniony</Badge>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">Niedostępny</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex-1 flex flex-col">
        <Badge variant="outline" className="w-fit mb-2 text-xs">
          {categoryLabels[product.category]}
        </Badge>
        
        <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)}>
          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#e6007e] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {product.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.short_description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-[#d4a84b]">
              {product.price.toLocaleString('pl-PL')}
            </span>
            <span className="text-gray-500 text-sm">
              PLN / {unitLabels[product.price_unit] || product.price_unit}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={!product.in_stock}
              className="flex-1 bg-[#e6007e] hover:bg-[#c70069]"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Do koszyka
            </Button>
            <Link to={createPageUrl(`ShopProduct?slug=${product.slug}`)}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}