// src/services/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import Constants from 'expo-constants';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || 'YOUR_API_KEY',
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || 'YOUR_AUTH_DOMAIN',
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || 'YOUR_PROJECT_ID',
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || 'YOUR_MESSAGING_SENDER_ID',
  appId: Constants.expoConfig?.extra?.firebaseAppId || 'YOUR_APP_ID',
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || 'YOUR_MEASUREMENT_ID',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Inicializar Firebase Cloud Messaging (apenas em ambientes suportados)
let messaging: any = null;

// Verificar suporte para FCM e inicializar
async function initMessaging() {
  if (await isSupported()) {
    messaging = getMessaging(app);
  }
}

initMessaging();

export { messaging };