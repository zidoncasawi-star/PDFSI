import { useEffect, useRef } from 'react';

// A real Google Mobile Ads (AdMob) SDK cannot run in a website — it's a
// native Android/iOS library, no web build exists. This is the actual
// ad network Google supports on websites: AdSense. It renders nothing
// until a real publisher/slot ID is configured, so there's no broken or
// fake ad request in the meantime — just the reserved placement, ready to
// go live the moment real IDs are set.
const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
const SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;

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
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!CLIENT_ID || !SLOT_ID) return;
    loadAdsenseScript(CLIENT_ID)
      .then(() => {
        // @ts-expect-error injected by the AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      })
      .catch(() => {});
  }, []);

  if (!CLIENT_ID || !SLOT_ID) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
