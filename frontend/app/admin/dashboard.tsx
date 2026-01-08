import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/utils/api';

const COLORS = {
  primary: '#2E7D32',
  accent: '#FF6D00',
  white: '#FFFFFF',
  background: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#D32F2F',
};

interface DashboardStats {
  totalCoupons: number;
  totalCategories: number;
  totalStores: number;
  totalStaff: number;
  todayRedemptions: number;
}

interface Redemption {
  id: string;
  coupon_title: string;
  coupon_code: string;
  store_name: string;
  staff_name: string;
  redeemed_at: string;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCoupons: 0,
    totalCategories: 0,
    totalStores: 0,
    totalStaff: 0,
    todayRedemptions: 0,
  });
  const [recentRedemptions, setRecentRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = await AsyncStorage.getItem('@admin_token');
    if (!storedToken) {
      router.replace('/admin/login');
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  };

  const fetchData = async (authToken: string) => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      
      const [couponsRes, categoriesRes, storesRes, staffRes, redemptionsRes] = await Promise.all([
        api.get('/admin/coupons', { headers }),
        api.get('/admin/categories', { headers }),
        api.get('/admin/stores', { headers }),
        api.get('/admin/staff', { headers }),
        api.get('/admin/redemptions?limit=10', { headers }),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayRedemptions = redemptionsRes.data.filter(
        (r: any) => r.redeem_date === today
      ).length;

      setStats({
        totalCoupons: couponsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalStores: storesRes.data.length,
        totalStaff: staffRes.data.length,
        todayRedemptions,
      });

      setRecentRedemptions(redemptionsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    if (token) {
      setRefreshing(true);
      fetchData(token);
    }
  }, [token]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['@admin_token', '@admin_id']);
    router.replace('/admin/login');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Oria Fresh Verwaltung</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.accent]} />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Gutscheine"
            value={stats.totalCoupons}
            icon="pricetag"
            color={COLORS.primary}
          />
          <StatCard
            title="Kategorien"
            value={stats.totalCategories}
            icon="grid"
            color={COLORS.accent}
          />
          <StatCard
            title="Filialen"
            value={stats.totalStores}
            icon="location"
            color="#2196F3"
          />
          <StatCard
            title="Mitarbeiter"
            value={stats.totalStaff}
            icon="people"
            color="#9C27B0"
          />
        </View>

        {/* Today's Redemptions */}
        <View style={styles.todayCard}>
          <View style={styles.todayIcon}>
            <Ionicons name="today" size={32} color={COLORS.accent} />
          </View>
          <View style={styles.todayInfo}>
            <Text style={styles.todayValue}>{stats.todayRedemptions}</Text>
            <Text style={styles.todayLabel}>Einlösungen heute</Text>
          </View>
        </View>

        {/* Recent Redemptions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letzte Einlösungen</Text>
          {recentRedemptions.length > 0 ? (
            recentRedemptions.map((redemption) => (
              <View key={redemption.id} style={styles.redemptionCard}>
                <View style={styles.redemptionIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.redemptionInfo}>
                  <Text style={styles.redemptionTitle}>{redemption.coupon_title}</Text>
                  <Text style={styles.redemptionMeta}>
                    {redemption.store_name} • {redemption.staff_name}
                  </Text>
                </View>
                <Text style={styles.redemptionTime}>
                  {formatDateTime(redemption.redeemed_at)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Noch keine Einlösungen</Text>
            </View>
          )}
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            Vollständige Verwaltung über das Web-Dashboard verfügbar.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  statTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  todayIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  todayInfo: {
    flex: 1,
  },
  todayValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.accent,
  },
  todayLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  redemptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  redemptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  redemptionInfo: {
    flex: 1,
  },
  redemptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  redemptionMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  redemptionTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 10,
    lineHeight: 18,
  },
});
