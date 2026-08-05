import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FaqProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqProps> = ({ lang }) => {
  const t = translations[lang].faq;
  const [openId, setOpenId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = t.items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/80 mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {t.title}
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأسئلة الشائعة (مثل: التوقيع القانوني، التشفير، الباقات)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-right flex items-center justify-between gap-4 font-bold text-base text-white hover:text-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-2 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
