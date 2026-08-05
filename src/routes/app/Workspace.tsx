import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { useAuth } from './AuthContext';
import {
  completeSign,
  getDocument,
  getDocumentBytes,
  getTemplate,
  saveTemplate,
  touchTemplate,
  updateDocumentFields
} from './data';
import { createSignatureSession, deleteSignatureSession, subscribeSignatureSession } from './signatureSession';
import { isMobileOrTabletDevice } from './device';
import type { FieldType, Signatory, WebDocument, WebField } from '../../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Computed once per page load — device type doesn't change mid-session.
const SHOW_QR_TAB = !isMobileOrTabletDevice();

const MODAL_TABS: Array<['draw' | 'type' | 'upload' | 'qr', string]> = [
  ['draw', 'Draw'],
  ['type', 'Type'],
  ['upload', 'Upload'],
  ['qr', 'Scan QR']
];

const SIGNATORY_COLORS = ['#DC2626', '#111827', '#4B5563', '#8a5cf6', '#c2410c'];
const FIELD_ICONS: Record<FieldType, string> = { signature: 'draw', initials: 'format_size', date: 'event', text: 'title' };
const FIELD_LABELS: Record<FieldType, string> = { signature: 'Signature', initials: 'Initials', date: 'Date Signed', text: 'Text Box' };
const DEFAULT_SIZE: Record<FieldType, { w: number; h: number }> = {
  signature: { w: 180, h: 60 },
  initials: { w: 90, h: 50 },
  date: { w: 140, h: 36 },
  text: { w: 160, h: 36 }
};

interface UiField extends WebField {
  xPx: number;
  yPx: number;
  wPx: number;
  hPx: number;
}

function todayFormatted() {
  return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function isFilled(f: UiField) {
  return f.type === 'text' || f.type === 'date' ? Boolean(f.text) : Boolean(f.dataUrl);
}

export default function Workspace() {
  const { docId } = useParams<{ docId: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const { user } = useAuth();
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const pageSizesRef = useRef<Record<number, { width: number; height: number }>>({});

  const [doc, setDoc] = useState<WebDocument | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [fieldsByPage, setFieldsByPage] = useState<Record<number, UiField[]>>({});
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [activeSignatoryId, setActiveSignatoryId] = useState<string>('');
  const [placingType, setPlacingType] = useState<FieldType | null>(null);
  const [modalFieldId, setModalFieldId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'draw' | 'type' | 'upload' | 'qr'>('draw');
  const [typedName, setTypedName] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const qrSessionIdRef = useRef<string | null>(null);

  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  const dragState = useRef<{
    fieldId: string;
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  // ---------- Load document ----------
  useEffect(() => {
    if (!user || !docId) return;
    let cancelled = false;

    (async () => {
      const record = await getDocument(user.uid, docId);
      if (!record || cancelled) return;
      setDoc(record);

      const sigs = record.signatories?.length ? record.signatories : [{ id: crypto.randomUUID(), name: user.displayName || user.email || 'You', color: SIGNATORY_COLORS[0] }];
      setSignatories(sigs);
      setActiveSignatoryId(sigs[0].id);

      const byPage: Record<number, UiField[]> = {};
      (record.fields || []).forEach((f) => {
        if (!byPage[f.page]) byPage[f.page] = [];
        byPage[f.page].push({ ...f, xPx: 0, yPx: 0, wPx: 0, hPx: 0 });
      });

      if (templateId) {
        const tpl = await getTemplate(user.uid, templateId);
        if (tpl) {
          tpl.fields.forEach((f) => {
            if (!byPage[f.page]) byPage[f.page] = [];
            byPage[f.page].push({
              id: crypto.randomUUID(),
              type: f.type,
              page: f.page,
              signatoryId: sigs[0].id,
              ratio: f.ratio,
              dataUrl: null,
              text: f.type === 'date' ? todayFormatted() : null,
              xPx: 0,
              yPx: 0,
              wPx: 0,
              hPx: 0
            });
          });
          await touchTemplate(user.uid, templateId);
        }
      }
      setFieldsByPage(byPage);

      const bytes = await getDocumentBytes(user.uid, record.storagePath);
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      if (cancelled) return;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setLoading(false);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, docId]);

  // ---------- Render current page ----------
  useEffect(() => {
    if (!pdfDocRef.current) return;
    let cancelled = false;

    (async () => {
      const page = await pdfDocRef.current!.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.4 });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvasSizeRef.current = { width: viewport.width, height: viewport.height };
      pageSizesRef.current[currentPage] = { width: viewport.width, height: viewport.height };
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.width = `${viewport.width}px`;
        canvasWrapRef.current.style.height = `${viewport.height}px`;
      }
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      if (cancelled) return;

      setFieldsByPage((prev) => {
        const pageFields = prev[currentPage] || [];
        const converted = pageFields.map((f) =>
          f.ratio
            ? { ...f, xPx: f.ratio.x * viewport.width, yPx: f.ratio.y * viewport.height, wPx: f.ratio.w * viewport.width, hPx: f.ratio.h * viewport.height }
            : f
        );
        return { ...prev, [currentPage]: converted };
      });
    })();

    return () => { cancelled = true; };
  }, [currentPage, numPages]);

  const currentFields = fieldsByPage[currentPage] || [];

  function updateField(fieldId: string, patch: Partial<UiField>) {
    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map((f) => (f.id === fieldId ? { ...f, ...patch } : f))
    }));
  }

  function removeField(fieldId: string) {
    setFieldsByPage((prev) => ({ ...prev, [currentPage]: (prev[currentPage] || []).filter((f) => f.id !== fieldId) }));
  }

  function handleCanvasClick(e: ReactMouseEvent<HTMLDivElement>) {
    if (!placingType) return;
    if ((e.target as HTMLElement).closest('.field-box')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { w, h } = DEFAULT_SIZE[placingType];
    const field: UiField = {
      id: crypto.randomUUID(),
      type: placingType,
      page: currentPage,
      signatoryId: activeSignatoryId,
      ratio: { x: 0, y: 0, w: 0, h: 0 },
      dataUrl: null,
      text: placingType === 'date' ? todayFormatted() : null,
      xPx: Math.max(0, x - w / 2),
      yPx: Math.max(0, y - h / 2),
      wPx: w,
      hPx: h
    };
    setFieldsByPage((prev) => ({ ...prev, [currentPage]: [...(prev[currentPage] || []), field] }));
    setPlacingType(null);

    if (field.type === 'signature' || field.type === 'initials') {
      openModal(field.id);
    } else if (field.type === 'text') {
      const text = prompt('Text:');
      if (text !== null) updateField(field.id, { text });
    }
  }

  function onFieldMouseDown(e: ReactMouseEvent, field: UiField, mode: 'move' | 'resize') {
    e.stopPropagation();
    e.preventDefault();
    dragState.current = { fieldId: field.id, mode, startX: e.clientX, startY: e.clientY, origX: field.xPx, origY: field.yPx, origW: field.wPx, origH: field.hPx };
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  }

  function onDragMove(e: globalThis.MouseEvent) {
    const ds = dragState.current;
    if (!ds) return;
    if (ds.mode === 'move') {
      updateField(ds.fieldId, { xPx: Math.max(0, ds.origX + (e.clientX - ds.startX)), yPx: Math.max(0, ds.origY + (e.clientY - ds.startY)) });
    } else {
      updateField(ds.fieldId, { wPx: Math.max(40, ds.origW + (e.clientX - ds.startX)), hPx: Math.max(24, ds.origH + (e.clientY - ds.startY)) });
    }
  }

  function onDragEnd() {
    dragState.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  }

  // ---------- Signature modal ----------
  function openModal(fieldId: string) {
    setModalFieldId(fieldId);
    setModalTab('draw');
    setTypedName('');
    setUploadPreview(null);
    requestAnimationFrame(() => {
      const c = drawCanvasRef.current;
      if (c) c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    });
  }

  function drawPos(e: ReactMouseEvent<HTMLCanvasElement>) {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
  }

  function handleDrawStart(e: ReactMouseEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    const ctx = drawCanvasRef.current!.getContext('2d')!;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    const p = drawPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }
  function handleDrawMove(e: ReactMouseEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = drawCanvasRef.current!.getContext('2d')!;
    const p = drawPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  function handleDrawEnd() {
    drawingRef.current = false;
  }
  function clearDraw() {
    const c = drawCanvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
  }

  // ---------- QR "sign on your phone" tab ----------
  useEffect(() => {
    if (!modalFieldId || modalTab !== 'qr' || !user || !SHOW_QR_TAB) return;
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const sessionId = await createSignatureSession(user.uid);
      if (cancelled) {
        deleteSignatureSession(sessionId);
        return;
      }
      qrSessionIdRef.current = sessionId;
      const url = `${window.location.origin}/app/mobile-sign/${sessionId}`;
      const png = await QRCode.toDataURL(url, { margin: 1, width: 260 });
      if (cancelled) return;
      setQrImage(png);

      unsubscribe = subscribeSignatureSession(sessionId, (session) => {
        if (session?.status === 'completed' && session.dataUrl) {
          updateField(modalFieldId, { dataUrl: session.dataUrl });
          setModalFieldId(null);
        }
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (qrSessionIdRef.current) {
        deleteSignatureSession(qrSessionIdRef.current);
        qrSessionIdRef.current = null;
      }
      setQrImage(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalFieldId, modalTab, user]);

  function saveSignatureToField() {
    if (!modalFieldId) return;
    let dataUrl: string | null = null;
    if (modalTab === 'draw') {
      dataUrl = drawCanvasRef.current!.toDataURL('image/png');
    } else if (modalTab === 'type') {
      if (!typedName.trim()) return;
      const c = document.createElement('canvas');
      c.width = 460; c.height = 180;
      const cx = c.getContext('2d')!;
      cx.font = "64px 'Caveat', cursive";
      cx.fillStyle = '#111827';
      cx.textBaseline = 'middle';
      cx.fillText(typedName, 20, 90);
      dataUrl = c.toDataURL('image/png');
    } else if (modalTab === 'upload') {
      if (!uploadPreview) return;
      dataUrl = uploadPreview;
    }
    if (!dataUrl) return;
    updateField(modalFieldId, { dataUrl });
    setModalFieldId(null);
  }

  // ---------- Serialize / save ----------
  // Recomputes each field's ratio from its current pixel position using the
  // viewport size of the page it belongs to (cached the last time that page
  // was rendered). Fields on pages never opened this session keep whatever
  // ratio they already had (restored from Firestore or a template).
  function serializeAllFields(): UiField[] {
    return Object.values(fieldsByPage)
      .flat()
      .map((f) => {
        const size = pageSizesRef.current[f.page];
        if (!size) return f;
        return {
          ...f,
          ratio: { x: f.xPx / size.width, y: f.yPx / size.height, w: f.wPx / size.width, h: f.hPx / size.height }
        };
      });
  }

  async function handleSaveDraft() {
    if (!user || !docId) return;
    const fields: WebField[] = serializeAllFields().map(({ xPx, yPx, wPx, hPx, ...f }) => f);
    await updateDocumentFields(user.uid, docId, fields, signatories);
    navigate('/app/documents');
  }

  async function handleSaveTemplate() {
    if (!user || !doc) return;
    const name = prompt('Template name:', doc.name.replace(/\.pdf$/i, ''));
    if (!name?.trim()) return;
    const layout = serializeAllFields().map((f) => ({ type: f.type, page: f.page, ratio: f.ratio }));
    if (!layout.length) {
      alert('Add at least one field before saving a template.');
      return;
    }
    await saveTemplate(user.uid, name.trim(), layout);
    alert('Template saved.');
  }

  async function handleFinish() {
    if (!user || !doc || !docId) return;
    const all = serializeAllFields();
    // Recompute ratios for every field from its current pixel position (pages already rendered at least once).
    const filled = all.filter((f) => (f.type === 'text' || f.type === 'date' ? f.text : f.dataUrl));
    if (filled.length === 0) {
      alert('Place and fill at least one field before finishing.');
      return;
    }

    const bytes = await getDocumentBytes(user.uid, doc.storagePath);
    const pdfDoc = await PDFDocument.load(bytes);
    const pages = pdfDoc.getPages();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const f of filled) {
      const page = pages[f.page - 1];
      if (!page) continue;
      const { width: pw, height: ph } = page.getSize();
      const xPt = f.ratio.x * pw;
      const wPt = f.ratio.w * pw;
      const hPt = f.ratio.h * ph;
      const yPt = ph - f.ratio.y * ph - hPt;

      if (f.type === 'signature' || f.type === 'initials') {
        const pngImage = await pdfDoc.embedPng(f.dataUrl!);
        page.drawImage(pngImage, { x: xPt, y: yPt, width: wPt, height: hPt });
      } else {
        const fontSize = Math.min(hPt * 0.6, 14);
        page.drawText(f.text || '', { x: xPt + 4, y: yPt + (hPt - fontSize) / 2, size: fontSize, font: helvetica, color: rgb(0.07, 0.09, 0.15) });
      }
    }

    const outBytes = await pdfDoc.save();
    const fieldsToSave: WebField[] = all.map(({ xPx, yPx, wPx, hPx, ...f }) => f);
    await updateDocumentFields(user.uid, docId, fieldsToSave, signatories);
    await completeSign(user.uid, docId, doc.storagePath, outBytes);
    navigate('/app/documents');
  }

  function addSignatory() {
    const name = prompt('Signer name:');
    if (!name?.trim()) return;
    const signatory: Signatory = { id: crypto.randomUUID(), name: name.trim(), color: SIGNATORY_COLORS[signatories.length % SIGNATORY_COLORS.length] };
    setSignatories((prev) => [...prev, signatory]);
    setActiveSignatoryId(signatory.id);
  }

  if (loading || !doc) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 -m-6 md:-m-10 p-6 md:p-10">
      {/* Document stage */}
      <div className="flex-1 flex flex-col items-center gap-4 min-w-0">
        <div className="w-full max-w-[900px] flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm text-on-surface-variant">Page {currentPage} / {numPages}</span>
            <button disabled={currentPage >= numPages} onClick={() => setCurrentPage((p) => p + 1)} className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <span className="text-sm font-semibold text-on-surface truncate max-w-[300px]">{doc.name}</span>
        </div>

        <div
          ref={canvasWrapRef}
          onClick={handleCanvasClick}
          className="relative shadow-lg rounded-lg overflow-hidden bg-white border border-outline-variant"
          style={{ cursor: placingType ? 'crosshair' : 'default' }}
        >
          <canvas ref={canvasRef} />
          <div className="absolute inset-0">
            {currentFields.map((f) => {
              const signatory = signatories.find((s) => s.id === f.signatoryId);
              return (
                <div
                  key={f.id}
                  className="field-box"
                  onMouseDown={(e) => onFieldMouseDown(e, f, 'move')}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (f.type === 'signature' || f.type === 'initials') openModal(f.id);
                    else if (f.type === 'text') {
                      const text = prompt('Text:', f.text || '');
                      if (text !== null) updateField(f.id, { text });
                    } else if (f.type === 'date') {
                      updateField(f.id, { text: todayFormatted() });
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: f.xPx,
                    top: f.yPx,
                    width: f.wPx,
                    height: f.hPx,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'move',
                    border: isFilled(f) ? `2px solid ${signatory?.color || '#DC2626'}` : `2px dashed ${signatory?.color || '#DC2626'}`,
                    background: isFilled(f) ? 'transparent' : 'rgba(220, 38, 38, 0.06)'
                  }}
                >
                  <div style={{ position: 'absolute', top: -20, left: 0, fontSize: 10, fontWeight: 600, color: signatory?.color || '#DC2626', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    {FIELD_LABELS[f.type]} · {signatory?.name}
                  </div>

                  {f.type === 'signature' || f.type === 'initials' ? (
                    f.dataUrl ? (
                      <img src={f.dataUrl} className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                      <span className="text-primary text-xs font-semibold pointer-events-none">Click to {f.type === 'signature' ? 'sign' : 'add initials'}</span>
                    )
                  ) : f.type === 'date' ? (
                    <span className="text-on-surface text-sm pointer-events-none">{f.text || todayFormatted()}</span>
                  ) : f.text ? (
                    <span className="text-on-surface text-sm pointer-events-none px-1 truncate">{f.text}</span>
                  ) : (
                    <span className="text-primary text-xs font-semibold pointer-events-none">Click to type</span>
                  )}

                  <div
                    onClick={(e) => { e.stopPropagation(); removeField(f.id); }}
                    style={{ position: 'absolute', top: -10, right: -10, width: 20, height: 20, borderRadius: '50%', background: '#DC2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', lineHeight: 1 }}
                  >
                    ×
                  </div>
                  <div
                    onMouseDown={(e) => onFieldMouseDown(e, f, 'resize')}
                    style={{ position: 'absolute', right: -6, bottom: -6, width: 14, height: 14, borderRadius: '50%', background: '#111827', border: '2px solid white', cursor: 'nwse-resize' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side panel */}
      <aside className="w-full md:w-[340px] flex-shrink-0 flex flex-col gap-6">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Fields</h2>
          <p className="text-sm text-on-surface-variant mb-3">Click a field type, then click anywhere on the document to place it. Drag to move, use the corner handle to resize.</p>

          <label className="flex flex-col gap-1 mb-3">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Assign to</span>
            <div className="flex gap-2">
              <select value={activeSignatoryId} onChange={(e) => setActiveSignatoryId(e.target.value)} className="flex-1 border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface-container-lowest">
                {signatories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={addSignatory} title="Add signer" className="border border-outline-variant rounded-lg px-3 text-on-surface-variant hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </button>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(FIELD_LABELS) as FieldType[]).map((type) => (
              <button
                key={type}
                onClick={() => setPlacingType(placingType === type ? null : type)}
                className={`flex flex-col items-center gap-1 border rounded-lg py-3 hover:border-primary hover:bg-primary-container/10 transition-colors ${placingType === type ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
              >
                <span className="material-symbols-outlined text-primary">{FIELD_ICONS[type]}</span>
                <span className="text-sm font-semibold text-on-surface">{FIELD_LABELS[type]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex-1">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Fields on this page</h2>
          <div className="flex flex-col gap-2">
            {currentFields.length === 0 && <p className="text-sm text-on-surface-variant">No fields yet.</p>}
            {currentFields.map((f) => {
              const signatory = signatories.find((s) => s.id === f.signatoryId);
              return (
                <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{FIELD_ICONS[f.type]}</span>
                    <span className="text-sm text-on-surface">{FIELD_LABELS[f.type]} — {signatory?.name}</span>
                  </div>
                  <span className={`material-symbols-outlined text-[16px] ${isFilled(f) ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                    {isFilled(f) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <button onClick={handleSaveTemplate} className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-semibold px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">style</span>
            Save as Template
          </button>
          <button onClick={handleSaveDraft} className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface text-sm font-semibold px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors">
            Save Draft
          </button>
          <button onClick={handleFinish} className="w-full bg-primary text-on-primary text-sm font-semibold px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">task_alt</span>
            Finish & Sign
          </button>
        </section>
      </aside>

      {/* Signature capture modal */}
      {modalFieldId && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setModalFieldId(null)}>
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-[520px] p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-on-surface">Add your signature</h3>
              <button onClick={() => setModalFieldId(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex gap-2 border-b border-outline-variant">
              {MODAL_TABS.filter(([tab]) => tab !== 'qr' || SHOW_QR_TAB).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-3 py-2 text-sm font-semibold border-b-2 ${modalTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {modalTab === 'draw' && (
              <div className="flex flex-col gap-2">
                <canvas
                  ref={drawCanvasRef}
                  width={460}
                  height={180}
                  className="bg-white border border-outline-variant rounded-lg cursor-crosshair w-full"
                  onMouseDown={handleDrawStart}
                  onMouseMove={handleDrawMove}
                  onMouseUp={handleDrawEnd}
                  onMouseLeave={handleDrawEnd}
                />
                <button onClick={clearDraw} className="self-start text-sm text-on-surface-variant hover:text-error">Clear</button>
              </div>
            )}

            {modalTab === 'type' && (
              <div className="flex flex-col gap-3">
                <input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Type your name"
                  className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <div className="bg-white border border-outline-variant rounded-lg h-[100px] flex items-center justify-center overflow-hidden">
                  <span style={{ fontFamily: 'Caveat, cursive' }} className="text-5xl text-on-surface">{typedName}</span>
                </div>
              </div>
            )}

            {modalTab === 'upload' && (
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = () => setUploadPreview(reader.result as string);
                    reader.readAsDataURL(f);
                  }}
                />
                <div className="bg-white border border-outline-variant rounded-lg h-[100px] flex items-center justify-center overflow-hidden">
                  {uploadPreview && <img src={uploadPreview} className="max-h-full max-w-full" />}
                </div>
              </div>
            )}

            {modalTab === 'qr' && (
              <div className="flex flex-col items-center gap-3 py-2">
                {qrImage ? (
                  <img src={qrImage} alt="Scan to sign on your phone" className="w-[220px] h-[220px]" />
                ) : (
                  <div className="w-[220px] h-[220px] flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                  </div>
                )}
                <p className="text-sm text-on-surface-variant text-center max-w-[320px]">
                  Scan this with your phone's camera to draw your signature on a touchscreen — it'll appear here
                  automatically, no app or sign-in needed on your phone.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalFieldId(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high">Cancel</button>
              {modalTab !== 'qr' && (
                <button onClick={saveSignatureToField} className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:opacity-90">Use this signature</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
