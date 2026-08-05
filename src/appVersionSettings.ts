import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AppVersionSettings {
  latestVersion: string;
  downloadUrl: string;
  releaseNotes: string;
  forceUpdate: boolean;
}

export const EMPTY_APP_VERSION_SETTINGS: AppVersionSettings = {
  latestVersion: '',
  downloadUrl: '',
  releaseNotes: '',
  forceUpdate: true
};

export function subscribeAppVersionSettings(cb: (settings: AppVersionSettings) => void) {
  if (!db) {
    cb(EMPTY_APP_VERSION_SETTINGS);
    return () => {};
  }
  return onSnapshot(doc(db, 'settings', 'appVersion'), (snap) => {
    cb(snap.exists() ? { ...EMPTY_APP_VERSION_SETTINGS, ...(snap.data() as Partial<AppVersionSettings>) } : EMPTY_APP_VERSION_SETTINGS);
  });
}

export async function saveAppVersionSettings(settings: AppVersionSettings) {
  if (!db) throw new Error('Firebase is not configured.');
  await setDoc(doc(db, 'settings', 'appVersion'), { ...settings, updatedAt: serverTimestamp() });
}
