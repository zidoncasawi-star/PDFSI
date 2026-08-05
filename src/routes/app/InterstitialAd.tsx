import { useEffect, useRef, useState } from 'react';
import type { AdSettings } from '../../adSettings';

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

function AdContent({ settings }: { settings: AdSettings }) {
  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings.interstitialType === 'adsense' && settings.interstitialAdsenseClientId) {
      loadAdsenseScript(settings.interstitialAdsenseClientId)
        .then(() => {
          // @ts-expect-error injected by the AdSense script
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        })
        .catch(() => {});
    }
  }, [settings]);

  useEffect(() => {
    // Re-execute any <script> tags in admin-provided HTML — innerHTML alone
    // doesn't run them.
    if (settings.interstitialType !== 'html' || !htmlRef.current) return;
    htmlRef.current.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }, [settings]);

  if (settings.interstitialType === 'adsense' && settings.interstitialAdsenseClientId && settings.interstitialAdsenseSlotId) {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={settings.interstitialAdsenseClientId}
        data-ad-slot={settings.interstitialAdsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  if (settings.interstitialType === 'html' && settings.interstitialHtml) {
    return <div ref={htmlRef} dangerouslySetInnerHTML={{ __html: settings.interstitialHtml }} />;
  }

  if (settings.interstitialType === 'image' && settings.interstitialImageUrl) {
    const img = <img src={settings.interstitialImageUrl} alt="Advertisement" className="max-w-full max-h-[300px] rounded-lg mx-auto" />;
    return settings.interstitialImageLink ? (
      <a href={settings.interstitialImageLink} target="_blank" rel="noopener noreferrer">{img}</a>
    ) : img;
  }

  return null;
}

export function InterstitialAd({ settings, onProceed }: { settings: AdSettings; onProceed: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = settings.interstitialDurationMs || 4000;
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setReady(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [settings.interstitialDurationMs]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-full max-w-[420px] p-6 flex flex-col items-center gap-5">
        <div className="w-full flex items-center justify-center min-h-[100px]">
          <AdContent settings={settings} />
        </div>

        {!ready ? (
          <div className="w-full flex flex-col gap-2">
            <p className="text-sm text-on-surface text-center">{settings.interstitialMessage || 'Preparing your file…'}</p>
            <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-primary transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setWorking(true); onProceed(); }}
            disabled={working}
            className="w-full bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            {working ? 'Please wait…' : 'Download'}
          </button>
        )}
      </div>
    </div>
  );
}
