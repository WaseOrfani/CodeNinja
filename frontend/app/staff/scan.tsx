import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
  success: '#4CAF50',
};

interface ValidationResult {
  valid: boolean;
  coupon_id?: string;
  coupon_title?: string;
  coupon_price?: number;
  error_code?: string;
  message: string;
}

export default function StaffScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    loadStaffInfo();
  }, []);

  const loadStaffInfo = async () => {
    const storedToken = await AsyncStorage.getItem('@staff_token');
    const storedStoreId = await AsyncStorage.getItem('@staff_store_id');
    
    if (!storedToken || !storedStoreId) {
      router.replace('/staff/login');
      return;
    }
    
    setToken(storedToken);
    setStoreId(storedStoreId);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanning || loading || !storeId || !token) return;
    
    setScanning(false);
    setLoading(true);
    setScannedData(data);
    
    // Vibrate to indicate scan
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }

    try {
      const res = await api.post('/redeem/validate', 
        { token: data, store_id: storeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err: any) {
      console.error('Validation error:', err);
      setResult({
        valid: false,
        error_code: 'ERROR',
        message: 'Fehler bei der Validierung',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!scannedData || !storeId || !token) return;
    
    setLoading(true);
    
    try {
      const res = await api.post('/redeem/confirm',
        { token: scannedData, store_id: storeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.valid) {
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 100, 100, 100]);
        }
        Alert.alert('Erfolg', 'Gutschein erfolgreich eingelöst!', [
          { text: 'OK', onPress: resetScanner },
        ]);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Confirm error:', err);
      Alert.alert('Fehler', 'Einlösung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setScannedData(null);
    setScanning(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['@staff_token', '@staff_id', '@staff_store_id']);
    router.replace('/staff/login');
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.permissionText}>Kamera-Zugriff benötigt</Text>
        <Text style={styles.permissionSubtext}>
          Um QR-Codes zu scannen, benötigen wir Zugriff auf die Kamera.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Zugriff erlauben</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Overlay */}
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR Scanner</Text>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Scan Frame */}
          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            {scanning && (
              <Text style={styles.scanHint}>QR-Code in den Rahmen halten</Text>
            )}
          </View>
        </SafeAreaView>
      </CameraView>

      {/* Result Modal */}
      {(result || loading) && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : result ? (
              <>
                <View style={[
                  styles.resultIcon,
                  { backgroundColor: result.valid ? '#E8F5E9' : '#FFEBEE' }
                ]}>
                  <Ionicons
                    name={result.valid ? 'checkmark-circle' : 'close-circle'}
                    size={48}
                    color={result.valid ? COLORS.success : COLORS.error}
                  />
                </View>
                <Text style={styles.resultTitle}>
                  {result.valid ? 'Gültig' : 'Ungültig'}
                </Text>
                <Text style={styles.resultMessage}>{result.message}</Text>
                
                {result.valid && result.coupon_title && (
                  <View style={styles.couponDetails}>
                    <Text style={styles.couponTitle}>{result.coupon_title}</Text>
                    {result.coupon_price && (
                      <Text style={styles.couponPrice}>
                        {result.coupon_price.toFixed(2).replace('.', ',')} €
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.resultButtons}>
                  {result.valid && (
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirm}
                    >
                      <Ionicons name="checkmark" size={20} color={COLORS.white} />
                      <Text style={styles.confirmButtonText}>Einlösen</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.cancelButton, result.valid && styles.cancelButtonSmall]}
                    onPress={resetScanner}
                  >
                    <Text style={styles.cancelButtonText}>
                      {result.valid ? 'Abbrechen' : 'Erneut scannen'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 24,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanHint: {
    position: 'absolute',
    bottom: -40,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  couponDetails: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  couponPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  resultButtons: {
    width: '100%',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonSmall: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});
