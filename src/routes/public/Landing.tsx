import { Link } from 'react-router-dom';
import Seo from './Seo';

const FEATURES = [
  {
    icon: 'draw',
    title: 'Draw, type or upload your signature',
    body: 'Add a signature to any PDF your way — sketch it with your mouse, type your name in a signature font, or upload an image. A true esign PDF experience, no scanner needed.'
  },
  {
    icon: 'dashboard_customize',
    title: 'Signature, initials, date & text fields',
    body: 'Place exactly the fields you need on your PDF doc, assign each one to a signer, resize and reposition them with a drag.'
  },
  {
    icon: 'style',
    title: 'Reusable templates',
    body: 'Save a field layout once and apply it to every new PDF document of that type in a single click.'
  },
  {
    icon: 'devices',
    title: 'PDF editor & signer — desktop or browser',
    body: 'Sign PDF documents fully offline with the Windows app, or sign a PDF online from any browser with the web app — your choice.'
  },
  {
    icon: 'history',
    title: 'Full audit trail',
    body: 'Every upload, field change and digital signature is logged, so you always know who signed the PDF and when.'
  },
  {
    icon: 'lock',
    title: 'You control your documents',
    body: 'Files are stored under your own account. Nothing is shared unless you export or send it yourself.'
  }
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sign Pdf',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Windows',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Sign Pdf is a free PDF editor and electronic signature tool. Sign PDF documents online or with the Windows desktop app, add a digital signature to any PDF, and manage every esign PDF request from one dashboard.'
};

export default function Landing() {
  return (
    <>
      <Seo
        title="Sign Pdf — Free Online PDF Editor & Electronic Signature Tool"
        description="Sign PDF documents online for free with Sign Pdf. Add a digital signature to any PDF, esign contracts in seconds, and manage every signed PDF from the browser or the Windows app."
        jsonLd={JSON_LD}
      />

      <section className="flex-1 flex flex-col items-center text-center px-6 py-20 md:py-28 gap-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-container/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Sign PDF documents in seconds
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface max-w-3xl leading-tight">
          Sign PDF online, <span className="text-primary">free — no paperwork.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Sign Pdf is a free PDF editor and esign PDF tool. Upload a PDF doc, add a signature to
          PDF fields, and digitally sign the document — from your browser or the Windows desktop
          app. No printing, no scanning, no back-and-forth.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/app/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">upload_file</span>
            Sign PDF online free
          </Link>
          <Link to="/download" className="border border-outline-variant text-on-surface font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Download for Windows
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">A PDF signature tool for every document</h2>
          <p className="text-on-surface-variant">
            Whether you need to sign a PDF for a new hire's contract, sign a PDF doc for a client,
            or create a digital signature for an internal policy, Sign Pdf handles it. Draw your
            signature, type it, or upload one — then place it anywhere in the PDF and finish. It
            works as a lightweight PDF editor for signature fields, initials, dates and text, so
            you never need separate software to prepare a document before signing it.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
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

      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface text-center">Why sign a PDF with Sign Pdf?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                Free electronic signature, no limits
              </h3>
              <p className="text-sm text-on-surface-variant">
                Sign PDF free, with no watermark and no page limit. Sign Pdf is a free PDF signature
                tool for individuals and teams alike — upgrade only if you need more from the admin
                dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                A real digital signature workflow
              </h3>
              <p className="text-sm text-on-surface-variant">
                Every electronic signature PDF you create is flattened directly into the document,
                with an audit trail recording who signed and when — so a signed PDF from Sign Pdf
                holds up as a genuine record.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                Sign a PDF from any device
              </h3>
              <p className="text-sm text-on-surface-variant">
                Sign PDF online from a browser on any computer, or install the Windows desktop app
                to sign the PDF fully offline. Your documents and templates stay in sync either way.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                Built for teams that sign PDF documents daily
              </h3>
              <p className="text-sm text-on-surface-variant">
                Save a template once, then prepare and sign PDF docs in one click for every new
                contract, NDA or onboarding form that follows the same layout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tertiary-container/5 border-t border-outline-variant px-6 py-16 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Ready to sign your first PDF document?</h2>
        <p className="text-on-surface-variant max-w-lg">Sign PDF online free in under a minute, or download the Windows app for offline signing.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/app/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Get started free
          </Link>
          <Link to="/download" className="border border-outline-variant text-on-surface font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-lowest transition-colors">
            Download for Windows
          </Link>
        </div>
      </section>
    </>
  );
}
