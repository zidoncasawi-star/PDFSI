import { useEffect, useRef, useState } from 'react';
import { subscribeAdSettings, type AdSettings } from '../../adSettings';
import { InterstitialAd } from './InterstitialAd';

function hasAdContent(s: AdSettings) {
  if (s.interstitialType === 'adsense') return !!(s.interstitialAdsenseClientId && s.interstitialAdsenseSlotId);
  if (s.interstitialType === 'html') return !!s.interstitialHtml;
  if (s.interstitialType === 'image') return !!s.interstitialImageUrl;
  return false;
}

// Shows the admin-configured interstitial (ad + "Preparing your file…" bar)
// before a download or "Finish & Sign" completes. Runs the real action
// concurrently with the minimum-display timer so the modal never adds more
// delay than its configured duration actually requires.
export function useInterstitial() {
  const settingsRef = useRef<AdSettings | null>(null);
  const [active, setActive] = useState<AdSettings | null>(null);

  useEffect(() => subscribeAdSettings((s) => { settingsRef.current = s; }), []);

  async function runWithInterstitial<T>(action: () => Promise<T>): Promise<T> {
    const settings = settingsRef.current;
    if (!settings || !settings.interstitialEnabledWeb || !hasAdContent(settings)) {
      return action();
    }
    setActive(settings);
    try {
      const [result] = await Promise.all([
        action(),
        new Promise((resolve) => setTimeout(resolve, settings.interstitialDurationMs || 4000))
      ]);
      return result;
    } finally {
      setActive(null);
    }
  }

  const modal = active ? <InterstitialAd settings={active} /> : null;
  return { runWithInterstitial, modal };
}
