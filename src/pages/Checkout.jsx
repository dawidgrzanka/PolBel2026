import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { useCart } from '@/components/shop/useCart';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ChevronRight, ShoppingBag, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const unitLabels = {
  szt: 'szt.',
  m2: 'm²',
  m3: 'm³',
  mb: 'mb',
  godz: 'godz.',
  dzień: 'dzień',
  usluga: 'usługa'
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    delivery_date: '',
    notes: ''
  });

  const createOrderMutation = useMutation({
    mutationFn: (data) => base44.entities.Order.create(data),
    onSuccess: (order) => {
      setOrderNumber(order.order_number);
      setOrderComplete(true);
      clearCart();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Koszyk jest pusty');
      return;
    }

    const orderNumber = `POL-${Date.now().toString(36).toUpperCase()}`;
    
    createOrderMutation.mutate({
      ...formData,
      order_number: orderNumber,
      items: JSON.stringify(cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        price_unit: item.price_unit,
        quantity: item.quantity
      }))),
      total: cartTotal,
      status: 'nowe'
    });
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Dziękujemy za zamówienie!
            </h1>
            <p className="text-gray-600 mb-2">
              Twoje zamówienie numer <strong className="text-[#e6007e]">{orderNumber}</strong> zostało przyjęte.
            </p>
            <p className="text-gray-600 mb-8">
              Skontaktujemy się z Tobą telefonicznie w celu potwierdzenia szczegółów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Shop')}>
                <Button variant="outline">Kontynuuj zakupy</Button>
              </Link>
              <Link to={createPageUrl('Home')}>
                <Button className="bg-[#e6007e] hover:bg-[#c70069]">
                  Wróć na stronę główną
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Koszyk jest pusty</h1>
            <p className="text-gray-600 mb-8">Dodaj produkty do koszyka, aby złożyć zamówienie.</p>
            <Link to={createPageUrl('Shop')}>
              <Button className="bg-[#e6007e] hover:bg-[#c70069]">
                Przejdź do sklepu
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
            <span className="text-gray-900">Zamówienie</span>
          </nav>

          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl('Shop')} className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Zamówienie</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dane do zamówienia</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Imię i nazwisko *
                        </label>
                        <Input
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon *
                        </label>
                        <Input
                          required
                          type="tel"
                          value={formData.customer_phone}
                          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                          placeholder="+48 123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        placeholder="jan@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres dostawy / realizacji *
                      </label>
                      <Input
                        required
                        value={formData.customer_address}
                        onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                        placeholder="ul. Przykładowa 1, 37-500 Jarosław"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferowana data realizacji
                      </label>
                      <Input
                        type="date"
                        value={formData.delivery_date}
                        onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Uwagi do zamówienia
                      </label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Dodatkowe informacje, preferencje dostawy..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#e6007e] hover:bg-[#c70069] text-lg"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? 'Przetwarzanie...' : 'Złóż zamówienie'}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Składając zamówienie akceptujesz nasz regulamin. 
                      Płatność przy odbiorze lub przelewem po potwierdzeniu.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#e6007e]" />
                    Podsumowanie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">📦</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x {item.price.toLocaleString('pl-PL')} PLN
                        </p>
                        <p className="text-sm font-semibold text-[#d4a84b]">
                          {(item.price * item.quantity).toLocaleString('pl-PL')} PLN
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Produkty ({cart.length})</span>
                      <span>{cartTotal.toLocaleString('pl-PL')} PLN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dostawa</span>
                      <span>Do ustalenia</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Suma</span>
                      <span className="text-[#d4a84b]">{cartTotal.toLocaleString('pl-PL')} PLN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}