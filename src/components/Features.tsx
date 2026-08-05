import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Users, Layers, Lock, Smartphone, Cloud, ArrowLeft, ArrowRight } from 'lucide-react';

interface FeaturesProps {
  lang: Language;
}

export const Features: React.FC<FeaturesProps> = ({ lang }) => {
  const t = translations[lang].features;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-blue-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-cyan-400" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-emerald-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-purple-400" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-sky-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 group shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/40 transition-all">
                    {getIcon(item.icon)}
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
                <span>تعرف على تفاصيل الميزة</span>
                {lang === 'ar' ? (
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
