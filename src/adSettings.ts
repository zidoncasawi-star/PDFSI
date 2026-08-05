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
  admobInterstitialAdUnitId: string;

  // Interstitial ad shown in a modal before a download or "Finish & Sign"
  // completes — see routes/app/InterstitialAd.tsx (web) and windows_app's
  // assets/js/interstitial.js. Unlike the AdSense banner, the ad content
  // itself can be AdSense, arbitrary HTML/script (e.g. another network's
  // tag), or a plain clickable image — whatever the admin has on hand.
  interstitialEnabledWeb: boolean;
  interstitialEnabledWindows: boolean;
  interstitialType: 'adsense' | 'html' | 'image';
  interstitialAdsenseClientId: string;
  interstitialAdsenseSlotId: string;
  interstitialHtml: string;
  interstitialImageUrl: string;
  interstitialImageLink: string;
  interstitialDurationMs: number;
  interstitialMessage: string;
}

export const EMPTY_AD_SETTINGS: AdSettings = {
  adsenseClientId: '',
  adsenseSlotId: '',
  adsenseEnabledWeb: false,
  adsenseEnabledWindows: false,
  admobAppId: '',
  admobBannerAdUnitId: '',
  admobInterstitialAdUnitId: '',

  interstitialEnabledWeb: false,
  interstitialEnabledWindows: false,
  interstitialType: 'adsense',
  interstitialAdsenseClientId: '',
  interstitialAdsenseSlotId: '',
  interstitialHtml: '',
  interstitialImageUrl: '',
  interstitialImageLink: '',
  interstitialDurationMs: 4000,
  interstitialMessage: 'Preparing your file…'
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
