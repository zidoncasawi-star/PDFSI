import { useEffect, useState } from 'react';
import { subscribeAdSettings } from '../../adSettings';

// A real Google Mobile Ads (AdMob) SDK cannot run in a website — it's a
// native Android/iOS library, no web build exists. This uses the actual ad
// network Google supports on websites: AdSense. Client/slot IDs and the
// on/off switch are managed live from the admin dashboard's Ads page
// (settings/ads in Firestore) rather than baked in at build time, so
// turning ads on or off never requires a redeploy.
let scriptLoadPromise: Promise<void> | null = null;
function loadAdsenseScript(clientId: string) {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load AdSense script'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export default function AdSlot({ className = '' }: { className?: string }) {
  const [ids, setIds] = useState<{ clientId: string; slotId: string } | null>(null);

  useEffect(() => subscribeAdSettings((s) => {
    setIds(s.adsenseEnabledWeb && s.adsenseClientId && s.adsenseSlotId ? { clientId: s.adsenseClientId, slotId: s.adsenseSlotId } : null);
  }), []);

  useEffect(() => {
    if (!ids) return;
    loadAdsenseScript(ids.clientId)
      .then(() => {
        // @ts-expect-error injected by the AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      })
      .catch(() => {});
  }, [ids]);

  if (!ids) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ids.clientId}
        data-ad-slot={ids.slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
