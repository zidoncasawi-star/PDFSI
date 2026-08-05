import { Link } from 'react-router-dom';
import Seo from './Seo';

const LINKS = [
  { to: '/terms', icon: 'gavel', title: 'Terms and Conditions', body: 'The rules for using the Sign Pdf web app and Windows desktop app.' },
  { to: '/privacy', icon: 'privacy_tip', title: 'Privacy Policy', body: 'What data we collect when you sign a PDF document, and how it\'s stored.' }
];

export default function Legal() {
  return (
    <>
      <Seo title="Legal — Sign Pdf" description="Legal information for Sign Pdf, including our Terms and Conditions and Privacy Policy." />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Legal</h1>
            <p className="text-on-surface-variant">Policies covering the Sign Pdf web app and Windows desktop app.</p>
          </div>

          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/60 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">{l.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-on-surface">{l.title}</h2>
                  <p className="text-sm text-on-surface-variant">{l.body}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </Link>
            ))}
          </div>

          <p className="text-center text-sm text-on-surface-variant">
            Questions about these policies? <Link to="/contact" className="text-primary hover:underline font-semibold">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
