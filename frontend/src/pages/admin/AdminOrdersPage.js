import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Eye, Clock, Phone, Mail, MapPin } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminOrdersPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await axios.get(`${API}/admin/orders${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Fehler beim Laden der Bestellungen');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      await axios.put(`${API}/admin/orders/${orderId}/status?new_status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status aktualisiert');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'paid', label: 'Bezahlt', color: 'bg-green-100 text-green-700' },
    { value: 'in_preparation', label: 'In Zubereitung', color: 'bg-blue-100 text-blue-700' },
    { value: 'ready', label: 'Abholbereit', color: 'bg-purple-100 text-purple-700' },
    { value: 'picked_up', label: 'Abgeholt', color: 'bg-slate-100 text-slate-700' },
    { value: 'cancelled', label: 'Storniert', color: 'bg-red-100 text-red-700' },
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || { label: status, color: 'bg-slate-100 text-slate-700' };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Bestellungen</h1>
          <p className="text-slate-500 mt-1">{orders.length} Bestellungen</p>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="order-status-filter">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          Keine Bestellungen gefunden
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Bestellung</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Kunde</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Abholzeit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Betrag</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="border-t border-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-mono text-sm font-medium text-slate-900">
                            #{order.id?.slice(0, 8).toUpperCase()}
                          </span>
                          <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">{order.customer_name}</p>
                        <p className="text-xs text-slate-500">{order.customer_phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="w-3 h-3" />
                          {order.pickup_time}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className={`h-8 w-36 text-xs ${statusInfo.color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slate-900">€{order.total?.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}
                          data-testid={`view-order-${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Bestellung #{selectedOrder?.id?.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-slate-900 mb-3">Kundeninformationen</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-900 font-medium">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedOrder.customer_phone}`} className="hover:text-green-600">
                    {selectedOrder.customer_phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedOrder.customer_email}`} className="hover:text-green-600">
                    {selectedOrder.customer_email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Abholzeit: {selectedOrder.pickup_time}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Bestellte Artikel</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <div>
                        <p className="text-slate-900">{item.quantity}x {item.product_name}</p>
                        <p className="text-slate-500 text-xs">{item.variant}</p>
                        {item.extras?.length > 0 && (
                          <p className="text-green-600 text-xs">+ {item.extras.map(e => e.name).join(', ')}</p>
                        )}
                      </div>
                      <span className="text-slate-900 font-medium">€{item.total?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-1">Anmerkungen</h3>
                  <p className="text-yellow-700 text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="font-semibold text-slate-900">Gesamtbetrag</span>
                <span className="text-xl font-bold text-green-600">€{selectedOrder.total?.toFixed(2)}</span>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Status ändern</h3>
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger data-testid="order-detail-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
