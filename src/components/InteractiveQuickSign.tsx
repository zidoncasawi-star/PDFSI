import React, { useState, useRef, useEffect } from 'react';
import { Language, SignatureField } from '../types';
import { translations, sampleDocs } from '../data/translations';
import {
  PenTool,
  Type,
  FileText,
  Upload,
  RotateCcw,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
  Award,
  Trash2,
  FileCheck,
  Check,
  Info
} from 'lucide-react';

interface QuickSignProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const InteractiveQuickSign: React.FC<QuickSignProps> = ({ lang, onOpenAuth }) => {
  const t = translations[lang].quickSign;
  const [selectedDocId, setSelectedDocId] = useState<string>('contract-nda');
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'stamp'>('draw');
  
  // Custom Typed Signature state
  const [typedName, setTypedName] = useState<string>(lang === 'ar' ? 'محمد العتيبي' : 'Alexander Wright');
  const [signatureFont, setSignatureFont] = useState<string>('font-serif italic');
  
  // Color selection
  const [inkColor, setInkColor] = useState<string>('#1e40af'); // Midnight blue
  
  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Placed Fields on Document
  const [placedSignature, setPlacedSignature] = useState<{
    type: 'drawn' | 'typed' | 'stamp';
    content: string;
    font?: string;
    color: string;
    x: number;
    y: number;
    date: string;
  } | null>({
    type: 'typed',
    content: lang === 'ar' ? 'محمد العتيبي' : 'Alexander Wright',
    font: 'font-serif italic',
    color: '#1e40af',
    x: 60,
    y: 70,
    date: '2026-07-29',
  });

  const [signedSuccess, setSignedSuccess] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const selectedDoc = sampleDocs.find((d) => d.id === selectedDocId) || sampleDocs[0];

  // Canvas Drawing logic
  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && !hasDrawn) {
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab, inkColor, hasDrawn]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Apply Signature to Document
  const handleApplySignature = () => {
    let content = '';
    if (activeTab === 'typed') {
      content = typedName || (lang === 'ar' ? 'التوقيع المعتمد' : 'Authorized Signature');
    } else if (activeTab === 'stamp') {
      content = lang === 'ar' ? 'تم الاعتماد والتوقيع - PDF SIGNER' : 'OFFICIALLY SIGNED & SEALED';
    } else if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        content = canvas.toDataURL();
      }
    }

    setPlacedSignature({
      type: activeTab,
      content,
      font: signatureFont,
      color: inkColor,
      x: 55,
      y: 65,
      date: new Date().toISOString().split('T')[0],
    });

    setSignedSuccess(true);
  };

  const colors = [
    { name: 'Midnight Blue', value: '#1e40af', bg: 'bg-blue-700' },
    { name: 'Executive Black', value: '#09090b', bg: 'bg-slate-900' },
    { name: 'Emerald Green', value: '#047857', bg: 'bg-emerald-700' },
    { name: 'Crimson Red', value: '#b91c1c', bg: 'bg-red-700' },
  ];

  return (
    <section id="quick-sign" className="py-20 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-800 text-xs font-semibold text-indigo-300 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>تجربة تفاعلية حية (Sandbox)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls: Select Document & Build Signature */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Document Selection Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{t.selectDoc}</span>
                <span className="text-[11px] text-indigo-400 font-normal">اختر من القائمة</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {sampleDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setSignedSuccess(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all ${
                      selectedDocId === doc.id
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedDocId === doc.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.category} • {doc.size}</div>
                      </div>
                    </div>
                    {selectedDocId === doc.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Signature Creation Tool */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('draw')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'draw'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{t.drawTab}</span>
                </button>

                <button
                  onClick={() => setActiveTab('type')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'type'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>{t.typeTab}</span>
                </button>

                <button
                  onClick={() => setActiveTab('stamp')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'stamp'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{t.stampTab}</span>
                </button>
              </div>

              {/* Ink Color Selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{t.colorLabel}</span>
                <div className="flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setInkColor(c.value)}
                      className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                        inkColor === c.value ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-110'
                      }`}
                      title={c.name}
                    >
                      {inkColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content 1: DRAW CANVAS */}
              {activeTab === 'draw' && (
                <div className="space-y-2">
                  <div className="relative rounded-xl border-2 border-dashed border-slate-800 bg-slate-900 overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-32 cursor-crosshair touch-none"
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs">
                        ارسم توقيعك بالماوس أو على شاشة اللمس هنا ✍️
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearCanvas}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium py-1 px-2 rounded hover:bg-rose-950/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.clear}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Content 2: TYPE NAME */}
              {activeTab === 'type' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      الاسم المكتوب بالتوقيع:
                    </label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="أدخل اسمك الكامل..."
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {t.signatureFont}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSignatureFont('font-serif italic text-xl')}
                        className={`p-2 rounded-lg border text-sm font-serif italic ${
                          signatureFont.includes('serif') ? 'bg-indigo-950 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        كلاسيكي رائع
                      </button>
                      <button
                        onClick={() => setSignatureFont('font-sans font-black tracking-widest text-lg uppercase')}
                        className={`p-2 rounded-lg border text-xs font-bold ${
                          signatureFont.includes('sans') ? 'bg-indigo-950 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        عصري بارز
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 3: OFFICIAL STAMP */}
              {activeTab === 'stamp' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-bold text-white">ختم الاعتماد الرسمي</div>
                  <div className="text-xs text-slate-400">
                    PDF SIGNER OFFICIAL STAMP • VERIFIED DIGITALLY
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <button
                id="apply-signature-btn"
                onClick={handleApplySignature}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.applySignature}</span>
              </button>
            </div>
          </div>

          {/* Right Preview Canvas: Real PDF Viewer Mockup */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-white ml-2">{selectedDoc.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">1 / {selectedDoc.pages} الصفحات</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                    PDF Reader v2.6
                  </span>
                </div>
              </div>

              {/* White Simulated PDF Sheet */}
              <div className="relative min-h-[420px] bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-200 flex flex-col justify-between overflow-hidden">
                {/* PDF Header Stamp */}
                <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedDoc.previewContent.header}</h4>
                    <p className="text-xs text-slate-400 mt-1">تاريخ الإنشاء: 2026-07-29 | الرقم المرجعي: PDF-9942</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
                      CONFIDENTIAL
                    </span>
                  </div>
                </div>

                {/* PDF Body Paragraphs */}
                <div className="my-6 space-y-3 text-sm leading-relaxed text-slate-300">
                  <p>{selectedDoc.previewContent.body}</p>
                  <p className="text-xs text-slate-400">
                    بموجب هذا المستند والتوقيع أدناه، يقر الطرفان بصحة البيانات المدونة مع مراعاة كافة الأنظمة واللوائح ذات الصلة.
                  </p>
                </div>

                {/* PDF Footer & Placed Signature Slot */}
                <div className="pt-4 border-t border-slate-800 relative">
                  <div className="text-xs font-semibold text-slate-400 mb-2">
                    {selectedDoc.previewContent.footer}
                  </div>

                  {/* Render Placed Signature if available */}
                  {placedSignature ? (
                    <div
                      className="p-3 rounded-xl border-2 border-dashed border-indigo-500/80 bg-indigo-950/40 relative group max-w-sm transition-all"
                      style={{ color: placedSignature.color }}
                    >
                      <div className="text-[10px] font-mono text-indigo-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> توقيع معتمد
                        </span>
                        <span>{placedSignature.date}</span>
                      </div>

                      {placedSignature.type === 'typed' && (
                        <div className={`${placedSignature.font} text-2xl font-bold tracking-wide my-1`}>
                          {placedSignature.content}
                        </div>
                      )}

                      {placedSignature.type === 'stamp' && (
                        <div className="p-2 rounded bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-bold text-xs text-center">
                          {placedSignature.content}
                        </div>
                      )}

                      {placedSignature.type === 'draw' && placedSignature.content && (
                        <img
                          src={placedSignature.content}
                          alt="Signature"
                          className="h-14 object-contain filter drop-shadow"
                        />
                      )}

                      <div className="mt-1 text-[9px] font-mono text-slate-400 border-t border-slate-800/60 pt-1 flex justify-between">
                        <span>SHA-256: 9e8a...31f2</span>
                        <span className="text-emerald-400 font-semibold">VALIDATED</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-dashed border-slate-800 text-center text-xs text-slate-400">
                      {t.dragHint}
                    </div>
                  )}
                </div>

                {/* Encrypted Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-6xl font-black text-white uppercase rotate-[-25deg]">
                  PDF SIGNER
                </div>
              </div>

              {/* Bottom Actions after signing */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.auditSuccess}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAuditModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.viewAudit}</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.downloadSigned}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Audit Certificate Modal Simulator */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">شهادة التدقيق التشفيرية (Audit Certificate)</h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400">Document ID: <span className="text-indigo-400">#DOC-2026-9942</span></div>
                <div className="text-slate-400">SHA-256 Digest: <span className="text-cyan-300 text-[10px] break-all">f891a27e310041b299e59d...44fa</span></div>
                <div className="text-slate-400">Timestamp UTC: <span className="text-white">2026-07-29 15:08:42.109 Z</span></div>
                <div className="text-slate-400">Signer IP: <span className="text-white">185.19.23.4 (Riyadh, SA)</span></div>
                <div className="text-slate-400">Legal Framework: <span className="text-emerald-400 font-bold">eIDAS Level 2 & Saudi Electronic Transactions Law</span></div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-center text-[11px] font-sans font-semibold">
                ✓ التوقيع موثق وغير قابل للتعديل بسجل زمني رقمي مشفر.
              </div>
            </div>

            <button
              onClick={() => setShowAuditModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              إغلاق الشهادة
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
