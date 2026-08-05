import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/contact', label: 'Contact us' },
  { to: '/faq', label: 'FAQs' },
  { to: '/activate', label: 'Activate' },
  { to: '/legal', label: 'Legal' },
  { to: '/terms', label: 'Terms and Conditions' },
  { to: '/privacy', label: 'Privacy Policy' }
];

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-12 border-t border-outline-variant bg-surface-container-low">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex flex-col gap-3 md:max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-sm">S</div>
            <span className="font-bold text-on-surface">Sign Pdf</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            Sign, prepare and manage PDF documents from your browser or the Windows desktop app —
            free electronic signatures with a full audit trail.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Quick Links</span>
          <nav className="flex flex-col gap-2">
            {QUICK_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-on-surface-variant hover:text-primary transition-colors w-fit">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-outline-variant text-sm text-on-surface-variant">
        © {new Date().getFullYear()} Sign Pdf. All rights reserved.
      </div>
    </footer>
  );
}
