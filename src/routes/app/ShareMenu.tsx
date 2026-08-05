import { useEffect, useRef, useState } from 'react';

type ShareTarget = {
  label: string;
  bg: string;
  fg: string;
  icon: string;
  buildUrl: (url: string, text: string) => string;
};

// Electron doesn't implement navigator.share() at all, and even in a real
// browser the native panel only shows up when the OS/browser wires it up —
// so we build the same picker ourselves and open each service's own web
// share intent in the default browser. Works identically everywhere.
const TARGETS: ShareTarget[] = [
  {
    label: 'WhatsApp',
    bg: '#25D366',
    fg: '#FFFFFF',
    icon: 'W',
    buildUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    label: 'X',
    bg: '#000000',
    fg: '#FFFFFF',
    icon: '\u{1D54F}',
    buildUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  },
  {
    label: 'Messages',
    bg: '#0A84FF',
    fg: '#FFFFFF',
    icon: '\u{1F4AC}',
    buildUrl: (url, text) => `sms:?&body=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    label: 'Facebook',
    bg: '#1877F2',
    fg: '#FFFFFF',
    icon: 'f',
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    label: 'Email',
    bg: '#6B7280',
    fg: '#FFFFFF',
    icon: '✉',
    buildUrl: (url, text) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
  }
];

export function ShareMenu({
  url,
  title,
  anchorRect,
  onClose
}: {
  url: string;
  title: string;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const top = Math.min(anchorRect.bottom + 8, window.innerHeight - 220);
  const left = Math.min(anchorRect.left, window.innerWidth - 340);

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', top, left, width: 320, zIndex: 1000 }}
      className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 flex flex-col gap-3"
    >
      <span className="text-sm font-semibold text-on-surface">Share</span>
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {TARGETS.map((t) => (
          <button
            key={t.label}
            onClick={() => {
              window.open(t.buildUrl(url, title), '_blank', 'noopener,noreferrer');
              onClose();
            }}
            className="flex flex-col items-center gap-1 flex-shrink-0"
            title={t.label}
          >
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: t.bg, color: t.fg }}
            >
              {t.icon}
            </span>
            <span className="text-[11px] text-on-surface-variant">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
        <span className="flex-1 text-xs text-on-surface-variant truncate">{url}</span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-xs font-semibold text-primary flex-shrink-0"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
