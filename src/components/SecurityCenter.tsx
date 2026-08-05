import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Lock, FileCheck, CheckCircle2, Search, Award } from 'lucide-react';

interface SecurityCenterProps {
  lang: Language;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ lang }) => {
  const t = translations[lang].security;
  const [docHashInput, setDocHashInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docHashInput.trim()) {
      setDocHashInput('SHA256-7f8a9b2c-2026-PDFSIGN');
    }
    setVerificationResult(t.verifyResultValid);
  };

  return (
    <section id="security" className="py-24 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>{t.featuresTitle}</span>
            </h3>

            <div className="space-y-4">
              {t.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2"
                >
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Verification Tool Simulator */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{t.verifyTitle}</h4>
                  <p className="text-xs text-slate-400">فحص وتوثيق صحة المستندات والتوقيعات</p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    الرمز التشفيري للـ PDF (Document Hash):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={docHashInput}
                      onChange={(e) => {
                        setDocHashInput(e.target.value);
                        setVerificationResult(null);
                      }}
                      placeholder={t.verifyPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{t.verifyBtn}</span>
                </button>
              </form>

              {verificationResult && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>نتيجة الفحص الفوري:</span>
                  </div>
                  <p>{verificationResult}</p>
                  <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-emerald-900 flex justify-between">
                    <span>Audit Status: ENCRYPTED</span>
                    <span>UTC: 2026-07-29</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
