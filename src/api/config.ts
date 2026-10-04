import {Platform} from 'react-native';

// Backend used by release builds. Set this to the deployed API before
// building the release APK/IPA. Everything else (images, sponsor, links...)
// is configured on the backend through its environment variables.
const PRODUCTION_API_URL = 'https://api.modhesh.com';

// Development: the Android emulator reaches the host machine through
// 10.0.2.2. On a physical device, use your computer's LAN IP instead.
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:8080`
  : PRODUCTION_API_URL;
