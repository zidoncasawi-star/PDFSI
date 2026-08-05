import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Play, ArrowLeft, ArrowRight, LayoutDashboard, FileCheck, CheckCircle2, Lock, Award } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDashboardPreview: () => void;
  onScrollToQuickSign: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenAuth,
  onOpenDashboardPreview,
  onScrollToQuickSign,
}) => {
  const t = translations[lang].hero;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950">
      {/* Glow Orbs background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-xs font-semibold text-indigo-300 mb-6 shadow-lg shadow-indigo-950/50">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{t.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
              {t.titleLine1}{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300">
                {t.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              {t.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <button
                id="hero-primary-cta"
                onClick={onScrollToQuickSign}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/55 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{t.primaryCta}</span>
                {lang === 'ar' ? (
                  <ArrowLeft className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>

              <button
                id="hero-dashboard-cta"
                onClick={onOpenDashboardPreview}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:text-white shadow-lg transition-all"
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                <span>{t.dashboardCta}</span>
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <Play className="w-4 h-4 fill-current text-indigo-400" />
                <span>{t.secondaryCta}</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-slate-800/80 w-full">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                {t.trustTitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs font-medium">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Encryption
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <Award className="w-3.5 h-3.5 text-blue-400" /> eIDAS & ESIGN Valid
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> SHA-256 Audit Trail
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Document Card Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-slate-900/90 p-4 border border-slate-800 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
              {/* Card Titlebar */}
              <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PDF_Signer_Certified.pdf</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                  VERIFIED
                </span>
              </div>

              {/* PDF Document Preview Canvas Visual */}
              <div className="mt-3 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-xs font-bold text-white">اتفاقية عقد تقديم خدمات رقمية</div>
                    <div className="text-[10px] text-slate-400">Ref ID: #SIG-8942-2026</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>

                {/* Skeleton Document Paragraphs */}
                <div className="space-y-2">
                  <div className="h-2.5 bg-slate-800/90 rounded w-full"></div>
                  <div className="h-2.5 bg-slate-800/90 rounded w-5/6"></div>
                  <div className="h-2.5 bg-slate-800/90 rounded w-4/6"></div>
                </div>

                {/* Signature Block Box */}
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 relative group hover:border-indigo-500 transition-colors">
                  <div className="flex items-center justify-between text-[11px] text-indigo-300 font-semibold mb-2">
                    <span>حقل التوقيع الإلكتروني:</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> تم التوقيع
                    </span>
                  </div>

                  {/* Simulated Signature */}
                  <div className="py-2 px-3 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="font-serif italic text-xl text-cyan-300 tracking-wider">
                      Abdullah Al-Kadi
                    </div>
                    <div className="text-right text-[9px] font-mono text-slate-400">
                      <div>2026-07-29 15:08 UTC</div>
                      <div className="text-indigo-400">IP: 185.19.23.4</div>
                    </div>
                  </div>

                  {/* Digital Stamp overlay */}
                  <div className="mt-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800/80 flex items-center justify-between">
                    <span className="truncate">SHA256: 7f8a9b2c...4e1a</span>
                    <span className="text-indigo-300 font-semibold">eIDAS Verified</span>
                  </div>
                </div>

                {/* Interactive Trigger Banner */}
                <button
                  onClick={onScrollToQuickSign}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>جرب أداة التوقيع التفاعلية أسفله الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">توقيع مشفر وآمن 100%</div>
                <div className="text-[11px] text-slate-400">شهادة تدقيق مرفقة مع كل مستند</div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Section Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {t.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors text-center"
            >
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
