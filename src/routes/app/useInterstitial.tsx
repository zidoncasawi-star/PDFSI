import { useEffect, useRef, useState } from 'react';
import { subscribeAdSettings, type AdSettings } from '../../adSettings';
import { InterstitialAd } from './InterstitialAd';

function hasAdContent(s: AdSettings) {
  if (s.interstitialType === 'adsense') return !!(s.interstitialAdsenseClientId && s.interstitialAdsenseSlotId);
  if (s.interstitialType === 'html') return !!s.interstitialHtml;
  if (s.interstitialType === 'image') return !!s.interstitialImageUrl;
  return false;
}

interface PendingAction<T> {
  settings: AdSettings;
  action: () => Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
}

// Shows the admin-configured interstitial (ad + "Preparing your file…" bar)
// before a download or "Finish & Sign" completes. The real action only
// runs once the bar finishes and the user clicks the "Download" button
// that replaces it — not while the ad is still up, so a native save
// dialog (Windows app) or browser download never fires underneath the ad.
export function useInterstitial() {
  const settingsRef = useRef<AdSettings | null>(null);
  const [pending, setPending] = useState<PendingAction<any> | null>(null);

  useEffect(() => subscribeAdSettings((s) => { settingsRef.current = s; }), []);

  function runWithInterstitial<T>(action: () => Promise<T>): Promise<T> {
    const settings = settingsRef.current;
    if (!settings || !settings.interstitialEnabledWeb || !hasAdContent(settings)) {
      return action();
    }
    return new Promise<T>((resolve, reject) => {
      setPending({ settings, action, resolve, reject });
    });
  }

  async function handleProceed() {
    if (!pending) return;
    try {
      const result = await pending.action();
      pending.resolve(result);
    } catch (err) {
      pending.reject(err);
    } finally {
      setPending(null);
    }
  }

  const modal = pending ? <InterstitialAd settings={pending.settings} onProceed={handleProceed} /> : null;
  return { runWithInterstitial, modal };
}
