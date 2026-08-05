import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from './Seo';

const FAQS = [
  {
    q: 'How do I sign a PDF online for free?',
    a: 'Create a free account and sign in at /app, upload your PDF doc, place a signature field, then draw, type or upload your signature. Click "Finish & Sign" and your signed PDF is ready to download — no payment required.'
  },
  {
    q: 'Is Sign Pdf really free to use?',
    a: 'Yes. Both the web app and the Windows desktop app let you sign PDF documents for free, with no watermark and no page limit. There is no forced trial period.'
  },
  {
    q: 'What\'s the difference between the web app and the Windows app?',
    a: 'The web app lets you sign a PDF online from any browser, with your documents stored securely in your account. The Windows desktop app lets you digitally sign a PDF fully offline, with files kept on your own machine. Both share the same signature and template tools.'
  },
  {
    q: 'Is an electronic signature from Sign Pdf legally valid?',
    a: 'Sign Pdf creates a visual electronic signature (drawn, typed or uploaded) flattened into the PDF, along with an audit trail of when it was signed. This covers most everyday agreements, but Sign Pdf does not yet offer certificate-based (PKI/PAdES) digital signatures — check your local regulations if you need that higher tier of legal certainty for a specific document.'
  },
  {
    q: 'Can I add a signature to a PDF that already has form fields?',
    a: 'Yes — upload the PDF doc as-is, then place a signature, initials, date or text field anywhere on the page, including directly over existing form fields.'
  },
  {
    q: 'Can other people sign the same PDF document?',
    a: 'You can assign each field to a named signer from the "Assign to" list while preparing the document, which is useful for keeping track of who signs what. Routing a document by email to outside signers isn\'t built in yet.'
  },
  {
    q: 'Where are my signed PDF files stored?',
    a: 'On the web app, files are stored in your own account and are only accessible to you and, if you enable it, an admin you\'ve granted access to. On the Windows app, files stay on your computer unless you turn on optional sync.'
  },
  {
    q: 'How do I activate the Windows app?',
    a: 'No license key is needed — install it and start signing right away. See the Activate page for details on linking it to your account for sync.'
  }
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
};

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Seo
        title="FAQs — Sign Pdf"
        description="Answers to common questions about signing a PDF online, adding a digital signature to a PDF, and using the free Sign Pdf web and Windows apps."
        jsonLd={JSON_LD}
      />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Frequently asked questions</h1>
            <p className="text-on-surface-variant">Everything about signing a PDF document with Sign Pdf.</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => {
              const open = openIndex === i;
              return (
                <div key={f.q} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  >
                    <span className="font-semibold text-on-surface">{f.q}</span>
                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {open && <p className="px-5 pb-4 text-sm text-on-surface-variant">{f.a}</p>}
                </div>
              );
            })}
          </div>

          <div className="text-center text-sm text-on-surface-variant">
            Still have a question?{' '}
            <Link to="/contact" className="text-primary hover:underline font-semibold">Contact us</Link>.
          </div>
        </div>
      </section>
    </>
  );
}
