import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { FileSignature, Globe, LogIn, LayoutDashboard, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDashboardPreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageToggle,
  onOpenAuth,
  onOpenDashboardPreview,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.features, href: '#features' },
    { label: t.howItWorks, href: '#how-it-works' },
    { label: t.useCases, href: '#use-cases' },
    { label: t.security, href: '#security' },
    { label: t.pricing, href: '#pricing' },
    { label: t.faq, href: '#faq' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                {t.brand}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                {t.brandSub}
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              id="header-lang-switcher"
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
              title="Change Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dashboard Preview Simulation Button */}
            <button
              id="header-dashboard-preview"
              onClick={onOpenDashboardPreview}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.dashboardPreview}</span>
            </button>

            {/* Login */}
            <button
              id="header-login-btn"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>{t.login}</span>
            </button>

            {/* Primary CTA */}
            <button
              id="header-get-started-btn"
              onClick={() => onOpenAuth('signup')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{t.getStarted}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-lang-btn"
              onClick={onLanguageToggle}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDashboardPreview();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboardPreview}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 border border-slate-700 text-center"
              >
                {t.login}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 text-center shadow-lg shadow-indigo-600/30"
              >
                {t.getStarted}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
