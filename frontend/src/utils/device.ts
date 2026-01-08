import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = '@oria_fresh_device_id';

export async function getDeviceId(): Promise<string> {
  try {
    // Check if we already have a device ID
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Generate a new UUID
      deviceId = await Crypto.randomUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback to a random ID if storage fails
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
