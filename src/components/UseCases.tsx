import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { UserCheck, Briefcase, Scale, CreditCard, CheckCircle2, FileText, ArrowLeft, ArrowRight } from 'lucide-react';

interface UseCasesProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const UseCases: React.FC<UseCasesProps> = ({ lang, onOpenAuth }) => {
  const t = translations[lang].useCases;
  const [selectedCaseId, setSelectedCaseId] = useState<string>('hr');

  const selectedCase = t.items.find((item) => item.id === selectedCaseId) || t.items[0];

  const getUseCaseIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-indigo-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-purple-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      default:
        return <UserCheck className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section id="use-cases" className="py-24 bg-slate-950 relative overflow-hidden">
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

        {/* Industry Nav Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {t.items.map((item) => {
            const isSelected = item.id === selectedCaseId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCaseId(item.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {getUseCaseIcon(item.icon)}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Use Case Content Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold">
              {getUseCaseIcon(selectedCase.icon)}
              <span>{selectedCase.subtitle}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedCase.title}
            </h3>

            <p className="text-base text-slate-300 leading-relaxed">
              {selectedCase.description}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                أبرز الفوائد للقطاع:
              </h4>
              <div className="space-y-2">
                {selectedCase.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('signup')}
              className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>جرب حلول {selectedCase.title}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Column: Visual Document Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {selectedCase.docSampleName}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                  READY TO SIGN
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
                <div className="h-2 bg-slate-800 rounded w-full"></div>
                <div className="h-2 bg-slate-800 rounded w-4/6"></div>
                <div className="h-2 bg-slate-800 rounded w-5/6"></div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">حالة التوقيع:</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تم الاعتماد والتوقيع
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <div>SHA256: 4a2b...9901</div>
                  <div className="text-indigo-300">ISO 27001 Verified</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
