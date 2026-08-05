import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { listenTemplates, uploadDocument } from './data';
import type { WebTemplate } from '../../types';
import { timeAgo } from './ui';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [templates, setTemplates] = useState<WebTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(searchParams.get('template'));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    return listenTemplates(user.uid, setTemplates);
  }, [user]);

  function pickFile(f: File | undefined | null) {
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
  }

  async function handleContinue() {
    if (!file || !user) return;
    setBusy(true);
    try {
      const record = await uploadDocument(user.uid, file);
      const tplParam = selectedTemplateId ? `?template=${selectedTemplateId}` : '';
      navigate(`/app/workspace/${record.id}${tplParam}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-on-surface">New Document</h1>
        <p className="text-on-surface-variant">Upload a PDF to prepare it for signing.</p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center gap-4 py-16 px-8 cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary/60'}`}
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
        <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl">upload_file</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-on-surface">Drag & drop a PDF here, or click to browse</p>
          <p className="text-sm text-on-surface-variant mt-1">PDF files only</p>
        </div>
      </div>

      {file && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-on-surface truncate">{file.name}</span>
            <span className="text-sm text-on-surface-variant">{(file.size / 1024).toFixed(0)} KB</span>
          </div>
          <button
            onClick={handleContinue}
            disabled={busy}
            className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy ? 'Uploading…' : 'Continue to prepare'}
          </button>
        </div>
      )}

      {templates.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-on-surface">Recent Templates</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.slice(0, 6).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(selectedTemplateId === t.id ? null : t.id)}
                className={`text-left bg-surface-container-lowest border rounded-lg p-3 hover:border-primary/60 transition-colors ${selectedTemplateId === t.id ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">style</span>
                  <span className="text-sm font-semibold text-on-surface truncate">{t.name}</span>
                </div>
                <span className="text-xs text-on-surface-variant">Last used {timeAgo(t.lastUsedAt)}</span>
              </button>
            ))}
          </div>
          {selectedTemplateId && (
            <p className="text-sm text-primary">Selected template will be applied once you upload a document.</p>
          )}
        </div>
      )}
    </div>
  );
}
