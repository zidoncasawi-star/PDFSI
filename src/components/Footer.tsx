import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { FileSignature, Globe, ShieldCheck, Lock, Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDashboardPreview: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onLanguageToggle,
  onOpenAuth,
  onOpenDashboardPreview,
}) => {
  const t = translations[lang].footer;
  const navT = translations[lang].nav;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <FileSignature className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white">{navT.brand}</span>
            </a>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onLanguageToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>

          {/* Links Column 1: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.linksHeading1}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#quick-sign" className="hover:text-indigo-400 transition-colors">أداة التوقيع الفورية</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">{navT.features}</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">{navT.howItWorks}</a></li>
              <li><a href="#use-cases" className="hover:text-indigo-400 transition-colors">{navT.useCases}</a></li>
              <li>
                <button onClick={onOpenDashboardPreview} className="hover:text-indigo-400 transition-colors text-right">
                  {navT.dashboardPreview}
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.linksHeading2}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#security" className="hover:text-indigo-400 transition-colors">{t.securityPage}</a></li>
              <li><a href="#security" className="hover:text-indigo-400 transition-colors">امتثال eIDAS & ESIGN</a></li>
              <li><a href="#security" className="hover:text-indigo-400 transition-colors">نظام التعاملات الإلكترونية</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.privacy}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.terms}</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.linksHeading3}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">{navT.pricing}</a></li>
              <li><a href="#faq" className="hover:text-indigo-400 transition-colors">{navT.faq}</a></li>
              <li><button onClick={() => onOpenAuth('signup')} className="hover:text-indigo-400 transition-colors">انضم إلينا</button></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.support}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>{t.rights}</div>
          <div className="flex items-center gap-1">
            <span>تم التطوير باستخدام أرقى معايير الأمان</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400 ml-1 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
