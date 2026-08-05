import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InteractiveQuickSign } from './components/InteractiveQuickSign';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { SecurityCenter } from './components/SecurityCenter';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DashboardPreviewModal } from './components/DashboardPreviewModal';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);

  // Update HTML direction attribute whenever language toggles
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleScrollToQuickSign = () => {
    const el = document.getElementById('quick-sign');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Tajawal','Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Header
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        onOpenAuth={handleOpenAuth}
        onOpenDashboardPreview={() => setDashboardModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        lang={lang}
        onOpenAuth={handleOpenAuth}
        onOpenDashboardPreview={() => setDashboardModalOpen(true)}
        onScrollToQuickSign={handleScrollToQuickSign}
      />

      {/* Interactive Quick Sign Sandbox */}
      <InteractiveQuickSign lang={lang} onOpenAuth={handleOpenAuth} />

      {/* Features Showcase */}
      <Features lang={lang} />

      {/* How It Works (3-step visual guide) */}
      <HowItWorks lang={lang} />

      {/* Industry Use Cases */}
      <UseCases lang={lang} onOpenAuth={handleOpenAuth} />

      {/* Security & Legal Compliance Center */}
      <SecurityCenter lang={lang} />

      {/* Pricing Plans */}
      <Pricing lang={lang} onOpenAuth={handleOpenAuth} />

      {/* Testimonials */}
      <Testimonials lang={lang} />

      {/* FAQ Accordions */}
      <FaqSection lang={lang} />

      {/* Footer */}
      <Footer
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        onOpenAuth={handleOpenAuth}
        onOpenDashboardPreview={() => setDashboardModalOpen(true)}
      />

      {/* Login & Sign Up Modal */}
      <AuthModal
        lang={lang}
        mode={authMode}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenDashboardPreview={() => setDashboardModalOpen(true)}
      />

      {/* Control Panel / Dashboard Interactive Preview Modal */}
      <DashboardPreviewModal
        lang={lang}
        isOpen={dashboardModalOpen}
        onClose={() => setDashboardModalOpen(false)}
      />
    </div>
  );
}
