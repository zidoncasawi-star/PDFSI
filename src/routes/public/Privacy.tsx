import Seo from './Seo';

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy — Sign Pdf" description="How Sign Pdf collects, stores and protects your data when you sign a PDF document." />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Privacy Policy</h1>
            <p className="text-sm text-on-surface-variant">Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="bg-error-container/40 border border-error/30 rounded-xl p-4 text-sm text-on-error-container">
            This is a general-purpose template, not legal advice. Have it reviewed against your
            actual data practices and local privacy law (e.g. GDPR) before relying on it.
          </div>

          <div className="flex flex-col gap-6 text-sm text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">1. What we collect</h2>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li><strong>Account data:</strong> your name and email address (via Firebase Authentication).</li>
                <li><strong>Documents:</strong> the PDF files you upload, the fields you place, and the signature images/text you create.</li>
                <li><strong>Activity log:</strong> a record of document uploads, edits and signatures (date, time, action) for your own audit trail.</li>
                <li><strong>Contact form:</strong> the name, email and message you submit via the Contact us page.</li>
                <li><strong>Desktop app (optional):</strong> if you enable sync in the Windows app's Settings, a summary of your documents and activity is sent to the same Firebase project — the PDF files themselves stay on your computer.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">2. How we use it</h2>
              <p>Solely to provide the Service: authenticate you, store and display your documents, show your activity history, and respond to messages you send us. We don't sell your data.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">3. Where it's stored</h2>
              <p>Your data is stored in Google Firebase (Firestore for metadata, Cloud Storage for PDF files), under your own account. Access is restricted by security rules so only you — and, if applicable, an authorized admin — can read your documents.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">4. Who can see it</h2>
              <p>Only you can access your documents by default. An admin account can view document metadata (names, statuses, timestamps) and your profile for support and platform-management purposes, but not the underlying PDF files.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">5. Your choices</h2>
              <p>You can delete any document from within the app at any time. To delete your account entirely, contact us via the Contact us page.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">6. Changes to this policy</h2>
              <p>We may update this policy from time to time; the "Last updated" date above will reflect the latest revision.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">7. Contact</h2>
              <p>Questions about your data? Reach out via the Contact us page.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
