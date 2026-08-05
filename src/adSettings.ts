import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AdSettings {
  adsenseClientId: string;
  adsenseSlotId: string;
  adsenseEnabledWeb: boolean;
  adsenseEnabledWindows: boolean;
  // Reserved for a future native Android/iOS app — AdMob's SDK can't run in
  // a browser (web app) or Electron (Windows app), only in a real native
  // mobile build, which doesn't exist in this project yet.
  admobAppId: string;
  admobBannerAdUnitId: string;
}

export const EMPTY_AD_SETTINGS: AdSettings = {
  adsenseClientId: '',
  adsenseSlotId: '',
  adsenseEnabledWeb: false,
  adsenseEnabledWindows: false,
  admobAppId: '',
  admobBannerAdUnitId: ''
};

export function subscribeAdSettings(cb: (settings: AdSettings) => void) {
  if (!db) {
    cb(EMPTY_AD_SETTINGS);
    return () => {};
  }
  return onSnapshot(doc(db, 'settings', 'ads'), (snap) => {
    cb(snap.exists() ? { ...EMPTY_AD_SETTINGS, ...(snap.data() as Partial<AdSettings>) } : EMPTY_AD_SETTINGS);
  });
}

export async function saveAdSettings(settings: AdSettings) {
  if (!db) throw new Error('Firebase is not configured.');
  await setDoc(doc(db, 'settings', 'ads'), { ...settings, updatedAt: serverTimestamp() });
}
