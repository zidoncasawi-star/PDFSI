import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  FileCheck,
  Clock,
  Send,
  HardDrive,
  FileText,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Search,
  CheckCircle2,
  Download,
  Eye,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface DashboardPreviewModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardPreviewModal: React.FC<DashboardPreviewModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const t = translations[lang].dashboardPreviewModal;

  const [docsList, setDocsList] = useState([
    {
      id: 'doc-1',
      title: 'عقد توريد مستلزمات عام 2026.pdf',
      recipient: 'شركة أفق المستقبل',
      date: '2026-07-28',
      status: 'signed',
      statusLabel: 'تم التوقيع بنجاح',
    },
    {
      id: 'doc-2',
      title: 'اتفاقية عدم الإفصاح والسرية NDA.pdf',
      recipient: 'سارة الخالد (مستشار قانوني)',
      date: '2026-07-29',
      status: 'pending',
      statusLabel: 'في انتظار التوقيع',
    },
    {
      id: 'doc-3',
      title: 'عقد توظيف - مهندس برمجيات.pdf',
      recipient: 'عمر التميمي',
      date: '2026-07-25',
      status: 'signed',
      statusLabel: 'تم التوقيع بنجاح',
    },
    {
      id: 'doc-4',
      title: 'امر شراء مواد بناء #PO-9021.pdf',
      recipient: 'مكتب الهندسية المعمارية',
      date: '2026-07-24',
      status: 'sent',
      statusLabel: 'تم الإرسال للمستلم',
    },
  ]);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleUploadNew = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: `مستند جديد مُرفع_${Math.floor(Math.random() * 1000)}.pdf`,
      recipient: 'مستلم جديد',
      date: '2026-07-29',
      status: 'pending',
      statusLabel: 'في انتظار التوقيع',
    };
    setDocsList([newDoc, ...docsList]);
    setNotificationMsg('تم رفع المستند الجديد بنجاح وإضافته لقائمة التوايع في لوحة التحكم!');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              PDF
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">{t.title}</h3>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.backToLanding}</span>
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {notificationMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {t.stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400">{stat.title}</div>
                <div className="text-xl font-extrabold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Actions & Recent Documents Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>{t.recentDocsTitle}</span>
            </h4>

            <button
              onClick={handleUploadNew}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.uploadNewCta}</span>
            </button>
          </div>

          {/* Documents Table */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-bold">اسم المستند</th>
                    <th className="p-3.5 font-bold">المستلم / الطرف الآخر</th>
                    <th className="p-3.5 font-bold">التاريخ</th>
                    <th className="p-3.5 font-bold">حالة التوقيع</th>
                    <th className="p-3.5 font-bold text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {docsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{doc.title}</span>
                      </td>
                      <td className="p-3.5">{doc.recipient}</td>
                      <td className="p-3.5 font-mono text-slate-400">{doc.date}</td>
                      <td className="p-3.5">
                        {doc.status === 'signed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {doc.statusLabel}
                          </span>
                        )}
                        {doc.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-semibold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-400" /> {doc.statusLabel}
                          </span>
                        )}
                        {doc.status === 'sent' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-semibold text-[10px]">
                            <Send className="w-3 h-3 text-blue-400" /> {doc.statusLabel}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="معاينة المستند"
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="تحميل"
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
