import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Euro, Clock, CheckCircle, QrCode, Gift } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, ordersData] = await Promise.all([
          api.getDashboard(),
          api.getOrders()
        ]);
        
        setDashboard(dashboardData);
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      title: 'Bestellungen heute', 
      value: dashboard?.orders_today || 0, 
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Umsatz heute', 
      value: `€${(dashboard?.revenue_today || 0).toFixed(2)}`, 
      icon: Euro,
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'QR-Bestellungen', 
      value: `${dashboard?.qr_orders_today || 0} (${dashboard?.qr_percentage || 0}%)`, 
      icon: QrCode,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      title: 'QR-Bonus vergeben', 
      value: dashboard?.qr_bonus_orders_today || 0, 
      icon: Gift,
      color: 'bg-pink-50 text-pink-600'
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700' },
      paid: { label: 'Bezahlt', color: 'bg-green-100 text-green-700' },
      in_preparation: { label: 'In Zubereitung', color: 'bg-blue-100 text-blue-700' },
      ready: { label: 'Abholbereit', color: 'bg-purple-100 text-purple-700' },
      picked_up: { label: 'Abgeholt', color: 'bg-slate-100 text-slate-700' },
      cancelled: { label: 'Storniert', color: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Übersicht für heute</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Letzte Bestellungen</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Noch keine Bestellungen heute</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Bestellung</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Kunde</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusInfo = getStatusBadge(order.status);
                    return (
                      <tr key={order.id} className="border-b border-slate-50">
                        <td className="py-3 px-2">
                          <span className="font-mono text-sm text-slate-900">
                            #{order.order_number || order.id?.toString().slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-slate-900">{order.customer_name}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="font-medium text-slate-900">€{order.total?.toFixed(2)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
