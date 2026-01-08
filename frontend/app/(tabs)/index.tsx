import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/utils/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const COLORS = {
  primary: '#2E7D32',
  accent: '#FF6D00',
  white: '#FFFFFF',
  background: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

interface Category {
  id: string;
  name: string;
  order: number;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  price: number;
  image_url: string;
  category_id: string;
  category_name: string;
  badges: string[];
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, coupRes] = await Promise.all([
        api.get('/categories'),
        api.get('/coupons'),
      ]);
      setCategories(catRes.data);
      setCoupons(coupRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const filteredCoupons = selectedCategory === 'all'
    ? coupons
    : coupons.filter(c => c.category_id === selectedCategory);

  const renderCategoryTab = (cat: { id: string; name: string }) => (
    <TouchableOpacity
      key={cat.id}
      style={[
        styles.categoryTab,
        selectedCategory === cat.id && styles.categoryTabActive,
      ]}
      onPress={() => setSelectedCategory(cat.id)}
    >
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === cat.id && styles.categoryTabTextActive,
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCouponCard = (coupon: Coupon) => (
    <TouchableOpacity
      key={coupon.id}
      style={styles.couponCard}
      onPress={() => router.push(`/coupon/${coupon.id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: coupon.image_url }} style={styles.couponImage} />
      {coupon.badges.length > 0 && (
        <View style={styles.badgeContainer}>
          {coupon.badges.map((badge, idx) => (
            <View key={idx} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.couponContent}>
        <Text style={styles.couponTitle} numberOfLines={2}>
          {coupon.title}
        </Text>
        <Text style={styles.couponSubtitle} numberOfLines={2}>
          {coupon.subtitle}
        </Text>
        <Text style={styles.couponPrice}>
          {coupon.price.toFixed(2).replace('.', ',')} €
        </Text>
      </View>
      <TouchableOpacity
        style={styles.qrButton}
        onPress={() => router.push(`/qr/${coupon.id}`)}
      >
        <Ionicons name="qr-code" size={16} color={COLORS.white} />
        <Text style={styles.qrButtonText}>QR anzeigen</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Lade Gutscheine...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ORIA</Text>
          <Text style={styles.logoSubtext}>FRESH</Text>
        </View>
        <Text style={styles.headerTitle}>Gutscheine</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {renderCategoryTab({ id: 'all', name: 'Alle' })}
        {categories.map(cat => renderCategoryTab(cat))}
      </ScrollView>

      {/* Coupons Grid */}
      <ScrollView
        style={styles.couponsScroll}
        contentContainerStyle={styles.couponsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.couponsGrid}>
          {filteredCoupons.map(renderCouponCard)}
        </View>
        {filteredCoupons.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Keine Gutscheine verfügbar</Text>
          </View>
        )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryScroll: {
    maxHeight: 56,
    backgroundColor: COLORS.white,
  },
  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },
  couponsScroll: {
    flex: 1,
  },
  couponsContent: {
    padding: 16,
  },
  couponsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  couponCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  couponImage: {
    width: '100%',
    height: CARD_WIDTH * 0.7,
    backgroundColor: COLORS.background,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  couponContent: {
    padding: 12,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  couponSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  couponPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  qrButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
