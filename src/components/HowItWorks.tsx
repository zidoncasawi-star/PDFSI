import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { UploadCloud, PenTool, FileCheck, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  lang: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const t = translations[lang].howItWorks;
  const [activeStep, setActiveStep] = useState<number>(1);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'UploadCloud':
        return <UploadCloud className="w-6 h-6" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6" />;
      default:
        return <PenTool className="w-6 h-6" />;
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-slate-900/40 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* 3-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-16">
          {t.steps.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-8 rounded-3xl cursor-pointer border transition-all duration-300 relative ${
                  isActive
                    ? 'bg-slate-950 border-indigo-500 shadow-2xl shadow-indigo-950/60 ring-2 ring-indigo-500/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                }`}
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {getStepIcon(s.icon)}
                  </div>
                  <span className="text-3xl font-black text-slate-800">
                    0{s.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span>{s.title}</span>
                  {isActive && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {s.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400">
                  ⚡ <strong className="text-indigo-300">{s.detail}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Interactive Step Preview Box */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-sm font-bold text-white">
                معاينة خطوة التوقيع (الخطوة رقم {activeStep})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              >
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setActiveStep(Math.min(3, activeStep + 1))}
                disabled={activeStep === 3}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              >
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {activeStep === 1 && (
            <div className="p-10 rounded-2xl border-2 border-dashed border-indigo-500/40 bg-indigo-950/20 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">قم بإسقاط ملف PDF هنا</h4>
                <p className="text-xs text-slate-400 mt-1">أو اختر من Google Drive / Dropbox / جهاز الحاسوب</p>
              </div>
              <div className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30">
                استعراض الملفات (PDF)
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>تحديد موقع حقل التوقيع بالسحب والإفلات</span>
                <span className="text-indigo-400 font-bold">2 من 2 حقول محددة</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">حقل توقيع الطرف الأول (المدير):</span>
                  <span className="font-serif italic text-lg text-cyan-300">Sami Al-Zahrani</span>
                </div>
                <span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded text-[10px] font-mono">OK</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-indigo-500 text-indigo-300 text-xs text-center">
                + انقر هنا لإضافة حقل التاريخ والختم الرسمي
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-800/80 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">المستند جاهز للتحميل والمشاركة</h4>
                <p className="text-xs text-slate-400 mt-1">تمت إضافة البصمة الزمنية وتشفير SHA-256 وسجل التدقيق</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30">
                  تحميل الملف النهائي (Signed PDF)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
