import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, Eye, Trash2, Phone, Mail, MapPin, Calendar, X
} from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusLabels = {
  nowe: 'Nowe',
  potwierdzone: 'Potwierdzone',
  w_realizacji: 'W realizacji',
  zakonczone: 'Zakończone',
  anulowane: 'Anulowane'
};

const statusColors = {
  nowe: 'bg-blue-100 text-blue-700',
  potwierdzone: 'bg-yellow-100 text-yellow-700',
  w_realizacji: 'bg-purple-100 text-purple-700',
  zakonczone: 'bg-green-100 text-green-700',
  anulowane: 'bg-red-100 text-red-700'
};

export default function OrdersManager({ orders }) {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Status zamówienia został zaktualizowany');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Zamówienie zostało usunięte');
      setDeleteOrderId(null);
    }
  });

  const handleStatusChange = (order, newStatus) => {
    updateMutation.mutate({ id: order.id, data: { status: newStatus } });
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const parseItems = (itemsJson) => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  const newOrdersCount = orders.filter(o => o.status === 'nowe').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zamówienia</h1>
          {newOrdersCount > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {newOrdersCount} nowych zamówień
            </p>
          )}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie ({orders.length})</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label} ({orders.filter(o => o.status === key).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Brak zamówień do wyświetlenia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const items = parseItems(order.items);
            return (
              <Card key={order.id} className={order.status === 'nowe' ? 'border-blue-200 bg-blue-50/30' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{order.order_number}</span>
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.created_date), 'd MMM yyyy, HH:mm', { locale: pl })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#d4a84b]">
                        {order.total?.toLocaleString('pl-PL')} PLN
                      </p>
                      <p className="text-sm text-gray-500">{items.length} produktów</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order, value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => setDeleteOrderId(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Zamówienie {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_email && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {selectedOrder.customer_email}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" /> {selectedOrder.customer_address}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Złożono: {format(new Date(selectedOrder.created_date), 'd MMMM yyyy, HH:mm', { locale: pl })}
                  </p>
                  {selectedOrder.delivery_date && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      Preferowana data: {format(new Date(selectedOrder.delivery_date), 'd MMMM yyyy', { locale: pl })}
                    </p>
                  )}
                  <Badge className={statusColors[selectedOrder.status]}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Produkty</h4>
                <div className="space-y-2">
                  {parseItems(selectedOrder.items).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.price?.toLocaleString('pl-PL')} PLN
                        </p>
                      </div>
                      <p className="font-semibold text-[#d4a84b]">
                        {(item.price * item.quantity).toLocaleString('pl-PL')} PLN
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Uwagi</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Suma zamówienia</span>
                <span className="text-2xl font-bold text-[#d4a84b]">
                  {selectedOrder.total?.toLocaleString('pl-PL')} PLN
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń zamówienie</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć to zamówienie? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deleteOrderId)}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}