import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShareMenu } from './ShareMenu';

// Public, unauthenticated page: the Windows app (Electron doesn't implement
// navigator.share() at all) opens this in the user's default browser so a
// single click here can trigger the browser/OS's own native share panel —
// something only a real top-level browser tab with a fresh user gesture can
// do.
export default function Share() {
  const [params] = useSearchParams();
  const url = params.get('url') || '';
  const title = params.get('title') || 'Document';
  const [fallback, setFallback] = useState<{ anchorRect: DOMRect } | null>(null);
  const [attempted, setAttempted] = useState(false);

  async function share(e: React.MouseEvent<HTMLButtonElement>) {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    setFallback({ anchorRect: e.currentTarget.getBoundingClientRect() });
  }

  useEffect(() => {
    document.title = `Share - ${title}`;
  }, [title]);

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <p className="text-on-surface-variant">No document to share.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface text-on-surface px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[32px]">description</span>
      </div>
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-on-surface-variant text-sm mt-1">Ready to share this document.</p>
      </div>
      <button
        onClick={(e) => { setAttempted(true); share(e); }}
        className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined">share</span>
        Share
      </button>
      {attempted && !navigator.share && (
        <p className="text-xs text-on-surface-variant">Your browser doesn't have a built-in share panel — use the options below.</p>
      )}

      {fallback && (
        <ShareMenu url={url} title={title} anchorRect={fallback.anchorRect} onClose={() => setFallback(null)} />
      )}
    </div>
  );
}
