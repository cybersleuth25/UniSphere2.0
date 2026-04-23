import { Platform } from 'react-native';

/**
 * Centralized configuration for the UniSphere mobile app.
 * Change the server IP/port here instead of updating 6+ files.
 */

// Backend server URL — change this when your local IP changes
const DEV_LOCAL_IP = '192.168.29.135';
const DEV_PORT = '8090';

export const BASE_URL = Platform.OS === 'web'
  ? `http://localhost:${DEV_PORT}`
  : `http://${DEV_LOCAL_IP}:${DEV_PORT}`;
