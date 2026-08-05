import { Link } from 'react-router-dom';
import { doc, increment, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Seo from './Seo';

// TODO: point this at the real installer once it's hosted somewhere public
// (e.g. a GitHub Releases asset on the windows_app repo, or your own CDN).
const DOWNLOAD_URL = 'https://github.com/zidoncasawi-star/PDFSI/releases/latest';

const STEPS = [
  { icon: 'download', title: 'Download the installer', body: 'Get the free Sign Pdf setup file for Windows 10 and 11 (64-bit).' },
  { icon: 'install_desktop', title: 'Install in under a minute', body: 'Run the installer and choose where to install — no admin account required.' },
  { icon: 'upload_file', title: 'Open a PDF doc', body: 'Drag in any PDF document, or browse for one, to start preparing it for signing.' },
  { icon: 'draw', title: 'Sign the PDF', body: 'Draw, type or upload your signature, place it on the document, and finish — digitally sign PDF files fully offline.' }
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sign Pdf for Windows',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Windows 10, Windows 11',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Download Sign Pdf for Windows — a free PDF editor and electronic signature app. Sign PDF documents, add a digital signature to any PDF, and sign the PDF fully offline.'
};

// Counts clicks on the "Download now" button for the admin dashboard. Not
// gated on sign-in (most visitors here aren't signed in yet), so this stays
// a plain increment-only counter — see firestore.rules' stats/downloads.
async function trackDownloadClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (!db) return;
  // Same-tab navigation to an external site would normally cancel any
  // in-flight write, so hold the click briefly (capped) and let the write
  // race a timeout rather than block navigation indefinitely.
  e.preventDefault();
  const write = setDoc(doc(db, 'stats', 'downloads'), { count: increment(1) }, { merge: true }).catch(() => {});
  await Promise.race([write, new Promise((resolve) => setTimeout(resolve, 800))]);
  window.location.href = DOWNLOAD_URL;
}

export default function Download() {
  return (
    <>
      <Seo
        title="Download Sign Pdf for Windows — Free PDF Signature App"
        description="Download the free Sign Pdf app for Windows and sign PDF documents offline. Add a digital signature to any PDF, sign a PDF doc in seconds, and keep every signed PDF on your own machine."
        jsonLd={JSON_LD}
      />

      <section className="flex flex-col items-center text-center px-6 py-20 md:py-24 gap-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-container/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
          Windows 10 & 11 · Free
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface max-w-3xl leading-tight">
          Sign PDF documents <span className="text-primary">offline, on Windows.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          The Sign Pdf desktop app is a free PDF editor and signature tool built for Windows. Sign
          a PDF doc, add a signature to a PDF contract, or create a digital signature for a policy
          — all without an internet connection.
        </p>

        <a
          href={DOWNLOAD_URL}
          onClick={trackDownloadClick}
          className="bg-primary text-on-primary font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
        >
          <span className="material-symbols-outlined">download</span>
          Download Sign Pdf for Windows — Free
        </a>
        <p className="text-xs text-on-surface-variant">
          Windows 10 / 11, 64-bit · No account required to install · Prefer the browser?{' '}
          <Link to="/app/login" className="text-primary hover:underline">Sign PDF online instead</Link>
        </p>
      </section>

      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-outline-variant bg-black">
          <video
            src="/intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto block"
          />
        </div>
      </section>

      <section className="px-6 md:px-12 pb-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">A free PDF signature app for Windows</h2>
          <p className="text-on-surface-variant">
            Most tools that let you sign a PDF online require an upload to someone else's server
            every time. The Sign Pdf desktop app works the other way around: it's a real PDF editor
            that lives on your machine, so you can digitally sign a PDF, prepare an electronic
            signature field, or sign for a PDF contract without your files ever leaving your
            computer — ideal for sensitive documents.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface text-center mb-10">How to sign a PDF with the Windows app</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3 relative">
                <span className="absolute top-4 right-4 text-xs font-bold text-on-surface-variant">{i + 1}</span>
                <div className="w-11 h-11 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <h3 className="font-semibold text-on-surface">{s.title}</h3>
                <p className="text-sm text-on-surface-variant">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold text-on-surface">What's included</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Free PDF signature — no watermark, no page limit</li>
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Signature, initials, date & text fields</li>
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Draw, type or upload your signature</li>
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Reusable templates for repeat documents</li>
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Works fully offline — nothing uploaded by default</li>
            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-[18px]">check</span>Light & dark mode</li>
          </ul>
          <a
            href={DOWNLOAD_URL}
            onClick={trackDownloadClick}
            className="self-start bg-primary text-on-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mt-2"
          >
            <span className="material-symbols-outlined">download</span>
            Download now
          </a>
        </div>
      </section>
    </>
  );
}
