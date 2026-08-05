import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-outline-variant sticky top-0 bg-background/95 backdrop-blur-sm z-40">
      <Link to="/" className="flex items-center gap-2">
        <img src="/icon.png" alt="Sign Pdf" className="w-9 h-9 rounded-lg object-cover" />
        <span className="text-lg font-bold text-on-surface">Sign Pdf</span>
      </Link>
      <nav className="flex items-center gap-1 md:gap-2">
        <Link to="/faq" className="hidden sm:inline-block text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2">
          FAQs
        </Link>
        <Link to="/contact" className="hidden sm:inline-block text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2">
          Contact us
        </Link>
        <Link
          to="/download"
          className="border border-outline-variant text-on-surface text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download
        </Link>
        <Link to="/app/login" className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Sign in
        </Link>
      </nav>
    </header>
  );
}
