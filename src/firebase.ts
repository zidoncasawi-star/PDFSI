import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import type { DeviceDoc } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

// The desktop app ("Sign Pdf" Windows) writes one document per installation into
// `lexissign_devices/{deviceId}` — see windows_app/src/assets/js/firebase-sync.js.
// This subscribes to all of them so the admin panel can show a combined view.
export function subscribeToDevices(callback: (devices: (DeviceDoc & { deviceId: string })[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'lexissign_devices'), (snapshot) => {
    const devices = snapshot.docs.map((d) => ({ deviceId: d.id, ...(d.data() as DeviceDoc) }));
    callback(devices);
  });
}
