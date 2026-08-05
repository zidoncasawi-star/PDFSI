import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: 'draw',
    title: 'Draw, type or upload your signature',
    body: 'Sign documents your way — sketch it with your mouse, type your name in a signature font, or upload an image.'
  },
  {
    icon: 'dashboard_customize',
    title: 'Signature, initials, date & text fields',
    body: 'Place exactly the fields you need, assign each one to a signer, resize and reposition them with a drag.'
  },
  {
    icon: 'style',
    title: 'Reusable templates',
    body: 'Save a field layout once and apply it to every new document of that type in a single click.'
  },
  {
    icon: 'devices',
    title: 'Desktop app or browser',
    body: 'Sign fully offline with the Windows app, or from any browser with the web app — your choice.'
  },
  {
    icon: 'history',
    title: 'Full audit trail',
    body: 'Every upload, field change and signature is logged, so you always know who did what and when.'
  },
  {
    icon: 'lock',
    title: 'You control your documents',
    body: 'Files are stored under your own account. Nothing is shared unless you export or send it yourself.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">S</div>
          <span className="text-lg font-bold text-on-surface">Sign Pdf</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/app/login" className="text-sm font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2">
            Sign in
          </Link>
          <Link to="/app/login" className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get started free
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center text-center px-6 py-20 md:py-28 gap-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-container/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Sign documents in seconds
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface max-w-3xl leading-tight">
          Sign any PDF, <span className="text-primary">without the paperwork.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-xl">
          Upload a document, place your fields, sign it — from your browser or the Windows desktop app.
          No printing, no scanning, no back-and-forth.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/app/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">upload_file</span>
            Start signing — it's free
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3 className="font-semibold text-on-surface">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-tertiary-container/5 border-t border-outline-variant px-6 py-16 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Ready to sign your first document?</h2>
        <Link to="/app/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Get started free
        </Link>
      </section>

      <footer className="px-6 md:px-12 py-8 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-on-surface-variant">
        <span>© {new Date().getFullYear()} Sign Pdf. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-xs">S</div>
          <span>Sign Pdf</span>
        </div>
      </footer>
    </div>
  );
}
