import { Link } from 'react-router-dom';
import Seo from './Seo';

export default function Activate() {
  return (
    <>
      <Seo
        title="Activate — Sign Pdf"
        description="How to activate the Sign Pdf Windows desktop app and link it to your account."
      />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Activate Sign Pdf</h1>
            <p className="text-on-surface-variant">No license key, no waiting — here's everything "activation" means for Sign Pdf.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">looks_one</span>
              </div>
              <div>
                <h2 className="font-semibold text-on-surface">Web app — nothing to activate</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Sign in at <Link to="/app/login" className="text-primary hover:underline">/app</Link> and start
                  signing PDF documents immediately. Your account is active as soon as you sign up.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">looks_two</span>
              </div>
              <div>
                <h2 className="font-semibold text-on-surface">Windows app — works right after install</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  <Link to="/download" className="text-primary hover:underline">Download and install</Link> the desktop
                  app — it opens ready to sign a PDF doc offline. No activation code required.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">looks_3</span>
              </div>
              <div>
                <h2 className="font-semibold text-on-surface">Optional: link it to your account</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  To see your desktop activity in the same dashboard as the web app, open the desktop app's{' '}
                  <strong>Settings</strong>, paste your Firebase project details, and enable sync. This step is
                  entirely optional — the app signs PDF files fully offline either way.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-on-surface-variant">
            Trouble getting set up? <Link to="/contact" className="text-primary hover:underline font-semibold">Contact us</Link>{' '}
            or check the <Link to="/faq" className="text-primary hover:underline font-semibold">FAQs</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
