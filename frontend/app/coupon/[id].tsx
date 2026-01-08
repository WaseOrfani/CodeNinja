import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/utils/api';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2E7D32',
  accent: '#FF6D00',
  white: '#FFFFFF',
  background: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

interface Coupon {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
  badges: string[];
  conditions: string;
  valid_from: string;
  valid_until: string;
}

export default function CouponDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      const res = await api.get(`/coupons/${id}`);
      setCoupon(res.data);
    } catch (error) {
      console.error('Error fetching coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!coupon) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Gutschein nicht gefunden</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Zurück</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: coupon.image_url }} style={styles.image} />
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        {coupon.badges.length > 0 && (
          <View style={styles.badgeContainer}>
            {coupon.badges.map((badge, idx) => (
              <View key={idx} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{coupon.category_name}</Text>
        </View>

        {/* Title & Price */}
        <Text style={styles.title}>{coupon.title}</Text>
        <Text style={styles.subtitle}>{coupon.subtitle}</Text>
        <Text style={styles.price}>{coupon.price.toFixed(2).replace('.', ',')} €</Text>

        {/* Code */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Gutschein-Code</Text>
          <Text style={styles.codeValue}>{coupon.code}</Text>
        </View>

        {/* Description */}
        {coupon.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beschreibung</Text>
            <Text style={styles.sectionText}>{coupon.description}</Text>
          </View>
        )}

        {/* Validity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gültigkeit</Text>
          <View style={styles.validityRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.validityText}>
              {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}
            </Text>
          </View>
        </View>

        {/* Conditions */}
        {coupon.conditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bedingungen</Text>
            <Text style={styles.sectionText}>{coupon.conditions}</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* QR Button */}
      <View style={styles.qrButtonContainer}>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push(`/qr/${coupon.id}`)}
        >
          <Ionicons name="qr-code" size={24} color={COLORS.white} />
          <Text style={styles.qrButtonText}>QR-Code anzeigen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  imageContainer: {
    width: width,
    height: width * 0.7,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 22,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  qrButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 10,
  },
});
