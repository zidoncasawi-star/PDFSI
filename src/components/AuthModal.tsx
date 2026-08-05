import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { X, FileSignature, ArrowLeft, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  lang: Language;
  mode: 'login' | 'signup';
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboardPreview: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  mode: initialMode,
  isOpen,
  onClose,
  onOpenDashboardPreview,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const t = translations[lang].authModal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    onOpenDashboardPreview();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileSignature className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? t.loginTitle : t.signupTitle}
          </h3>
          <p className="text-xs text-slate-400">{t.subtitle}</p>
        </div>

        {/* Social Google Login Button */}
        <button
          onClick={() => {
            onClose();
            onOpenDashboardPreview();
          }}
          className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>{t.googleBtn}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="h-[1px] bg-slate-800 flex-1"></div>
          <span>{t.orEmail}</span>
          <div className="h-[1px] bg-slate-800 flex-1"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.nameLabel}:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="عبدالله محمد"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {t.emailLabel}:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {t.passwordLabel}:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-[11px] text-indigo-300">
            {t.demoDashboardNotice}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? t.loginCta : t.signupCta}</span>
            {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="text-center pt-2">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {mode === 'login' ? t.switchSignup : t.switchLogin}
          </button>
        </div>
      </div>
    </div>
  );
};
