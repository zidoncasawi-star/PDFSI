import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const t = translations[lang].testimonials;

  return (
    <section className="py-24 bg-slate-900/40 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between relative group hover:border-slate-700 transition-colors"
            >
              <Quote className="w-8 h-8 text-indigo-600/30 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-800/80">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.role} • <span className="text-indigo-400">{item.company}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
