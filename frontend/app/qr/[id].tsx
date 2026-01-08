import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import api from '../../src/utils/api';
import { getDeviceId } from '../../src/utils/device';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.7;

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

interface Coupon {
  id: string;
  code: string;
  title: string;
  price: number;
}

export default function QRCodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const refreshRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCouponAndToken();
    
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (refreshRef.current) clearTimeout(refreshRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (token) {
      // Start countdown
      setCountdown(60);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Auto-refresh token
            refreshToken();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [token]);

  const fetchCouponAndToken = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch coupon details
      const couponRes = await api.get(`/coupons/${id}`);
      setCoupon(couponRes.data);
      
      // Get device ID and fetch token
      const deviceId = await getDeviceId();
      const tokenRes = await api.post(`/coupons/${id}/token`, {
        device_id: deviceId,
      });
      setToken(tokenRes.data.token);
    } catch (err: any) {
      console.error('Error:', err);
      if (err.response?.data?.detail === 'ALREADY_REDEEMED_TODAY') {
        setError('Du hast diesen Gutschein heute bereits eingelöst.');
      } else {
        setError('Fehler beim Laden des QR-Codes');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const deviceId = await getDeviceId();
      const tokenRes = await api.post(`/coupons/${id}/token`, {
        device_id: deviceId,
      });
      setToken(tokenRes.data.token);
    } catch (err: any) {
      console.error('Error refreshing token:', err);
      if (err.response?.data?.detail === 'ALREADY_REDEEMED_TODAY') {
        setError('Du hast diesen Gutschein heute bereits eingelöst.');
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }
  };

  const getCountdownColor = () => {
    if (countdown <= 10) return COLORS.error;
    if (countdown <= 30) return COLORS.accent;
    return COLORS.primary;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Lade QR-Code...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR-Code</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCouponAndToken}>
              <Text style={styles.retryButtonText}>Erneut versuchen</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Coupon Info */}
            {coupon && (
              <View style={styles.couponInfo}>
                <Text style={styles.couponTitle}>{coupon.title}</Text>
                <Text style={styles.couponCode}>{coupon.code}</Text>
                <Text style={styles.couponPrice}>
                  {coupon.price.toFixed(2).replace('.', ',')} €
                </Text>
              </View>
            )}

            {/* QR Code */}
            <View style={styles.qrContainer}>
              {token && (
                <QRCode
                  value={token}
                  size={QR_SIZE}
                  backgroundColor={COLORS.white}
                  color={COLORS.text}
                />
              )}
            </View>

            {/* Countdown */}
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Gültig noch</Text>
              <Text style={[styles.countdown, { color: getCountdownColor() }]}>
                {countdown} Sekunden
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(countdown / 60) * 100}%`,
                      backgroundColor: getCountdownColor(),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.instructionsText}>
                Zeige diesen QR-Code an der Kasse vor. Der Code wird automatisch erneuert.
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
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
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  couponInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  couponTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  couponPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  countdown: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressBar: {
    width: width * 0.6,
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
    lineHeight: 18,
  },
});
