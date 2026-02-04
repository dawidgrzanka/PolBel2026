import React, { useState } from 'react';
import { polbelApi} from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, Eye, Trash2, Phone, Mail, MapPin, Calendar, ExternalLink, MessageCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const statusLabels = {
  nowe: 'Nowe',
  potwierdzone: 'Potwierdzone',
  w_realizacji: 'W realizacji', 
  zakonczone: 'Zakończone',
  anulowane: 'Anulowane'
};

const statusColors = {
  nowe: 'bg-blue-100 text-blue-700 border-blue-200',
  potwierdzone: 'bg-amber-100 text-amber-700 border-amber-200',
  w_realizacji: 'bg-purple-100 text-purple-700 border-purple-200',
  zakonczone: 'bg-green-100 text-green-700 border-green-200',
  anulowane: 'bg-red-100 text-red-700 border-red-200'
};

export default function OrdersManager({ orders = [] }) {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const queryClient = useQueryClient();

  // FIX: Poprawiono polbelApiClient na polbelApi
  const updateMutation = useMutation({
  // Rozbijamy obiekt na id i resztę danych (status), 
  // a potem przekazujemy je jako OSOBNE argumenty
  mutationFn: ({ id, ...data }) => polbelApi.entities.Order.update(id, data), 
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    toast.success('Status zaktualizowany!');
  },
  onError: (error) => {
    console.error("Błąd aktualizacji:", error);
    toast.error('Nie udało się zmienić statusu.');
  }
});

  const deleteMutation = useMutation({
    mutationFn: (id) => polbelApi.entities.Order.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Usunięto zamówienie');
      setDeleteOrderId(null);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Brak daty';
    try {
      return format(parseISO(dateString), 'd MMM yyyy, HH:mm', { locale: pl });
    } catch {
      return dateString;
    }
  };

  // BEZPIECZNE PARSOWANIE PRODUKTÓW
  const getSafeItems = (items) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    try {
      return typeof items === 'string' ? JSON.parse(items) : [];
    } catch (e) {
      console.error("Błąd parsowania produktów:", e);
      return [];
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);
  const newOrdersCount = orders.filter(o => o.status === 'nowe').length;

  return (
    <div className="space-y-6">
      {/* Nagłówek i Filtry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Zarządzanie Zamówieniami</h1>
          <p className="text-sm text-gray-500 font-medium">
            {newOrdersCount > 0 ? (
              <span className="text-[#e6007e] animate-pulse">● {newOrdersCount} nowe do obsłużenia</span>
            ) : "Wszystkie zamówienia są aktualne"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filtruj:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] rounded-xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie ({orders.length})</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista zamówień */}
      <div className="grid gap-4">
        {filteredOrders.map(order => (
          <Card 
            key={order.id} 
            className={`group transition-all duration-300 border-none shadow-sm hover:shadow-md ${
              order.status === 'nowe' ? 'ring-2 ring-blue-400 ring-inset bg-blue-50/20' : 'bg-white'
            }`}
          >
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-black text-gray-900">{order.order_number}</span>
                    <Badge variant="outline" className={`${statusColors[order.status]} border font-bold rounded-lg`}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(order.created_at || order.created_date)}</span>
                    <span className="flex items-center gap-1 font-bold text-gray-900"><Package className="w-3.5 h-3.5" /> {order.customer_name}</span>
                  </div>
                </div>

                <div className="flex-row items-center lg:items-end justify-between lg:justify-center gap-1 px-4 border-l border-r border-gray-100 hidden sm:flex">
                    <span className="text-2xl font-black text-[#d4a84b]">{Number(order.total).toLocaleString('pl-PL')}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">PLN brutto</span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Select
                    value={order.status}
                    onValueChange={(val) => updateMutation.mutate({ id: order.id, status: val })}
                  >
                    <SelectTrigger className="w-36 h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="secondary" size="icon" className="rounded-xl bg-gray-100 hover:bg-gray-200" onClick={() => setSelectedOrder(order)}>
                    <Eye className="w-4 h-4 text-gray-700" />
                  </Button>

                  <Button variant="ghost" size="icon" className="rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50" onClick={() => setDeleteOrderId(order.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Szczegółów */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl rounded-3xl overflow-hidden border-none p-0">
          {selectedOrder && (
            <>
              <DialogHeader className="p-8 bg-gray-900 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl font-black">Zamówienie {selectedOrder.order_number}</DialogTitle>
                    <p className="text-gray-400 text-sm mt-1">{formatDate(selectedOrder.created_at || selectedOrder.created_date)}</p>
                  </div>
                  <Badge className={`${statusColors[selectedOrder.status]} border-none px-4 py-1 text-white`}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <section className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Klient i dostawa</h4>
                    <div className="space-y-3">
                      <p className="font-bold text-gray-900 flex items-center gap-2"><Package className="w-4 h-4 text-[#e6007e]" /> {selectedOrder.customer_name}</p>
                      <a href={`tel:${selectedOrder.customer_phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-bold">
                        <Phone className="w-4 h-4" /> {selectedOrder.customer_phone}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                      <p className="flex items-start gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 mt-0.5 text-gray-400" /> {selectedOrder.customer_address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Akcje szybkiego kontaktu</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl" asChild>
                        <a href={`https://wa.me/${selectedOrder.customer_phone?.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl" asChild>
                        <a href={`mailto:${selectedOrder.customer_email}`}>
                          <Mail className="w-4 h-4 mr-2 text-blue-500" /> E-mail
                        </a>
                      </Button>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lista produktów</h4>
                  <div className="border rounded-2xl overflow-hidden shadow-sm">
                    {getSafeItems(selectedOrder.items).map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white border-b last:border-0 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} {item.unit || 'szt.'} x {Number(item.price).toLocaleString('pl-PL')} PLN</p>
                        </div>
                        <span className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString('pl-PL')} PLN</span>
                      </div>
                    ))}
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span className="font-black text-gray-900 uppercase text-sm tracking-tighter">Suma całkowita:</span>
                      <span className="text-xl font-black text-[#d4a84b]">{Number(selectedOrder.total).toLocaleString('pl-PL')} PLN</span>
                    </div>
                  </div>
                </section>

                {selectedOrder.notes && (
                  <section className="space-y-2">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Uwagi od klienta</h4>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-900 leading-relaxed italic">
                      "{selectedOrder.notes}"
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Usuwania */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">Nieodwracalne usunięcie</AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              Czy na pewno chcesz usunąć zamówienie? Informacje o transakcji znikną z bazy danych na zawsze.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-none bg-gray-100 font-bold hover:bg-gray-200">Anuluj</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-red-500 font-bold hover:bg-red-600" onClick={() => deleteMutation.mutate(deleteOrderId)}>
              Tak, usuń trwale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}