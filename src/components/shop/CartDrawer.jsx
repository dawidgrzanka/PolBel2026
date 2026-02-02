import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const unitLabels = {
  szt: 'szt.',
  m2: 'm²',
  m3: 'm³',
  mb: 'mb',
  godz: 'godz.',
  dzień: 'dzień',
  usluga: 'usługa'
};

export default function CartDrawer({ open, onClose, cart, onUpdateQuantity, onRemove }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e6007e]" />
            Koszyk ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-500 mb-4">Twój koszyk jest pusty</p>
            <Button onClick={onClose} variant="outline">
              Kontynuuj zakupy
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-sm text-[#d4a84b] font-semibold">
                      {item.price.toLocaleString('pl-PL')} PLN / {unitLabels[item.price_unit] || item.price_unit}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-red-500 hover:text-red-700"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Suma:</span>
                <span className="text-[#d4a84b]">{total.toLocaleString('pl-PL')} PLN</span>
              </div>
              <Link to={createPageUrl('Checkout')} onClick={onClose}>
                <Button className="w-full bg-[#e6007e] hover:bg-[#c70069] h-12">
                  Przejdź do zamówienia
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Kontynuuj zakupy
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}