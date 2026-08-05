import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useParams } from 'react-router-dom';
import { completeSignatureSession } from './signatureSession';
import { isFirebaseConfigured } from '../../firebase';

// Public, deliberately unauthenticated page — opened by scanning the QR
// code shown in the desktop/web Signing Workspace. Draw a signature here on
// a phone (touch-friendly), submit, and it appears back in the workspace
// automatically via the shared signatureSessions/{sessionId} document.
export default function MobileSign() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function pos(e: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function start(e: ReactPointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  }

  function end() {
    drawingRef.current = false;
  }

  function clear() {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setHasDrawn(false);
  }

  async function submit() {
    if (!sessionId || !hasDrawn) return;
    setStatus('sending');
    try {
      const dataUrl = canvasRef.current!.toDataURL('image/png');
      await completeSignatureSession(sessionId, dataUrl);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (!isFirebaseConfigured || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-on-surface-variant">This sign-in link isn't valid. Go back to the desktop or computer and try again.</p>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-3 text-center">
        <span className="material-symbols-outlined text-tertiary text-6xl">check_circle</span>
        <h1 className="text-xl font-bold text-on-surface">Signature sent</h1>
        <p className="text-on-surface-variant">Go back to your computer — it's already been placed on the document. You can close this tab.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
      <div className="flex items-center gap-2">
        <img src="/icon.png" alt="Sign Pdf" className="w-8 h-8 rounded-lg object-cover" />
        <span className="font-bold text-on-surface">Sign Pdf</span>
      </div>
      <h1 className="text-lg font-semibold text-on-surface">Draw your signature</h1>
      <canvas
        ref={canvasRef}
        width={600}
        height={280}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="bg-white border-2 border-outline-variant rounded-xl w-full max-w-md touch-none"
        style={{ aspectRatio: '600 / 280' }}
      />
      {status === 'error' && <p className="text-error text-sm">Something went wrong — try again.</p>}
      <div className="flex gap-3 w-full max-w-md">
        <button onClick={clear} className="flex-1 border border-outline-variant text-on-surface font-semibold px-4 py-3 rounded-lg">
          Clear
        </button>
        <button
          onClick={submit}
          disabled={!hasDrawn || status === 'sending'}
          className="flex-1 bg-primary text-on-primary font-semibold px-4 py-3 rounded-lg disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Use this signature'}
        </button>
      </div>
    </div>
  );
}
