import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Check, Sparkles, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Pricing: React.FC<PricingProps> = ({ lang, onOpenAuth }) => {
  const t = translations[lang].pricing;
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<'SAR' | 'USD'>('SAR');

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {t.subtitle}
          </p>

          {/* Toggle Monthly / Yearly & Currency Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Billing cycle pill */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isYearly
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isYearly
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{t.yearly}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                  {t.discountBadge}
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCurrency('SAR')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currency === 'SAR' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                ريال (SAR)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.plans.map((plan) => {
            const price = isYearly
              ? currency === 'SAR' ? plan.priceYearlySAR : plan.priceYearlyUSD
              : currency === 'SAR' ? plan.priceMonthlySAR : plan.priceMonthlyUSD;

            const currSymbol = currency === 'SAR' ? 'ر.س' : '$';

            return (
              <div
                key={plan.id}
                className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-indigo-500 shadow-2xl shadow-indigo-950/80 scale-105 z-10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[11px] font-black tracking-wider uppercase shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>الخطة الأكثر شعبية</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-300 min-h-[36px] mb-6">
                    {plan.description}
                  </p>

                  {/* Price Header */}
                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white">
                        {price === 0 ? (lang === 'ar' ? 'مجاناً' : 'Free') : `${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-lg font-bold text-indigo-400">
                          {currSymbol}
                        </span>
                      )}
                      {price > 0 && (
                        <span className="text-xs text-slate-400 font-medium">
                          / {isYearly ? (lang === 'ar' ? 'شهرياً يُدفع سنوياً' : 'mo billed annually') : (lang === 'ar' ? 'شهرياً' : 'mo')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      ما تتضمنه الخطة:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                        <div className={`p-1 rounded-full ${plan.popular ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onOpenAuth(plan.id === 'free' ? 'signup' : 'signup')}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xl shadow-indigo-600/35 hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Money Back Guarantee Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto text-center flex items-center justify-center gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            ضمان استرجاع الأموال بنسبة 100% خلال 14 يوماً بدون أية أسئلة معقدة.
          </span>
        </div>

      </div>
    </section>
  );
};
