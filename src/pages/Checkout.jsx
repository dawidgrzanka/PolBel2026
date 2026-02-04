import React, { useState, useEffect } from 'react';
import { polbelApi} from '@/api/apiClient';
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
import { Home, ChevronRight, ShoppingBag, Trash2, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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

  // Przewijanie do góry przy zmianie stanu na sukces
  useEffect(() => {
    if (orderComplete) {
      window.scrollTo(0, 0);
    }
  }, [orderComplete]);

  const createOrderMutation = useMutation({
    mutationFn: (data) => polbelApi.entities.Order.create(data),
    onSuccess: (response) => {
      // response to obiekt zwrócony przez serwer po INSERT
      setOrderNumber(response?.order_number || 'W TRAKCIE');
      setOrderComplete(true);
      clearCart();
      toast.success('Zamówienie zostało złożone!');
    },
    onError: (error) => {
      console.error('Błąd zamówienia:', error);
      toast.error('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Twój koszyk jest pusty');
      return;
    }

    // Generujemy unikalny numer zamówienia dla bazy
    const generatedNumber = `POL-${Date.now().toString(36).toUpperCase()}`;
    
    // Przygotowanie danych (ZGODNIE Z TABELĄ MYSQL)
    const orderData = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      customer_address: formData.customer_address,
      delivery_date: formData.delivery_date || null,
      notes: formData.notes,
      order_number: generatedNumber,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.price_unit
      })),
      total: cartTotal,
      status: 'nowe'
    };

    createOrderMutation.mutate(orderData);
  };

  // WIDOK SUKCESU PO ZAMÓWIENIU
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Brawo!</h1>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Zamówienie przyjęte do realizacji</h2>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10 text-left">
              <div className="flex justify-between border-b pb-4 mb-4">
                <span className="text-gray-500">Numer zamówienia:</span>
                <span className="font-bold text-[#e6007e]">{orderNumber}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Nasz konsultant skontaktuje się z Tobą pod numerem <span className="font-bold">{formData.customer_phone}</span> w ciągu najbliższych godzin roboczych, aby potwierdzić termin dostawy i szczegóły płatności.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Shop')}>
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl border-gray-200">
                  Kontynuuj zakupy
                </Button>
              </Link>
              <Link to={createPageUrl('Home')}>
                <Button className="w-full sm:w-auto h-12 px-8 bg-[#e6007e] hover:bg-[#c70069] text-white font-bold rounded-xl shadow-lg shadow-[#e6007e]/20">
                  Powrót do strony głównej
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // WIDOK FORMULARZA KASY
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to={createPageUrl('Home')} className="hover:text-gray-900 flex items-center gap-1">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={createPageUrl('Shop')} className="hover:text-gray-900 font-medium">Sklep</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#e6007e] font-bold">Kasa</span>
          </nav>

          <div className="flex items-center gap-4 mb-10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finalizacja zamówienia</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Formularz */}
            <div className="lg:col-span-2">
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 p-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#e6007e]/10 text-[#e6007e] rounded-full flex items-center justify-center text-sm">1</span>
                    Twoje dane kontaktowe
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                          Imię i nazwisko *
                        </label>
                        <Input
                          required
                          className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          placeholder="np. Jan Kowalski"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                          Telefon kontaktowy *
                        </label>
                        <Input
                          required
                          type="tel"
                          className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                          value={formData.customer_phone}
                          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                          placeholder="+48 000 000 000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                        Adres e-mail
                      </label>
                      <Input
                        type="email"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        placeholder="jan@kowalski.pl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                        Adres dostawy / realizacji budowy *
                      </label>
                      <Input
                        required
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        value={formData.customer_address}
                        onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                        placeholder="ul. Budowlana 12, 37-500 Jarosław"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                        Preferowany termin (opcjonalnie)
                      </label>
                      <Input
                        type="date"
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                        value={formData.delivery_date}
                        onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                        Dodatkowe informacje / Uwagi
                      </label>
                      <Textarea
                        className="rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all min-h-[120px]"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Np. wjazd od strony północnej, potrzebny HDS..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-[#e6007e] hover:bg-[#c70069] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#e6007e]/20 transition-all hover:scale-[1.01]"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Składanie zamówienia...
                        </>
                      ) : (
                        'Potwierdzam i zamawiam'
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <AlertCircle className="w-3 h-3" />
                      Płatność zostanie ustalona podczas rozmowy telefonicznej.
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Podsumowanie Koszyka */}
            <div className="space-y-6">
              <Card className="rounded-3xl border-none shadow-sm sticky top-24 overflow-hidden">
                <CardHeader className="bg-gray-900 text-white p-6">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#d4a84b]" />
                    Twoje zakupy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="group flex gap-4 p-2 rounded-2xl transition-colors hover:bg-gray-50">
                        <div className="w-16 h-16 bg-white rounded-xl border overflow-hidden flex-shrink-0">
                          {item.main_image || item.image ? (
                            <img src={item.main_image || item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#e6007e] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">
                            {item.quantity} {unitLabels[item.price_unit] || 'szt.'} x {Number(item.price).toLocaleString('pl-PL')} PLN
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm font-black text-[#d4a84b]">
                              {(item.price * item.quantity).toLocaleString('pl-PL')} PLN
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                              title="Usuń z koszyka"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-500">Wartość produktów:</span>
                      <span className="text-gray-900 font-bold">{cartTotal.toLocaleString('pl-PL')} PLN</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-500">Koszt dostawy:</span>
                      <span className="text-green-600 font-bold">Wycena indywidualna</span>
                    </div>
                    <div className="pt-4 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Do zapłaty ok.</span>
                        <span className="text-3xl font-black text-[#d4a84b] leading-none">
                          {cartTotal.toLocaleString('pl-PL')}
                        </span>
                      </div>
                      <span className="text-gray-400 font-bold mb-1">PLN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Box informacyjny */}
              <div className="bg-[#d4a84b]/10 p-5 rounded-2xl border border-[#d4a84b]/20">
                <p className="text-xs text-[#a8822d] font-bold uppercase mb-2">Pamiętaj</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Złożenie zamówienia nie zobowiązuje do natychmiastowej płatności. Zadzwonimy, by potwierdzić dostępność i ustalić najtańszą opcję transportu na Twoją budowę.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}