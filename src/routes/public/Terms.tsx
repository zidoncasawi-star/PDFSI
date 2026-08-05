import Seo from './Seo';

export default function Terms() {
  return (
    <>
      <Seo title="Terms and Conditions — Sign Pdf" description="The terms and conditions for using the Sign Pdf web app and Windows desktop app." />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Terms and Conditions</h1>
            <p className="text-sm text-on-surface-variant">Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="bg-error-container/40 border border-error/30 rounded-xl p-4 text-sm text-on-error-container">
            This is a general-purpose template, not legal advice. Have a lawyer review and adapt it
            to your jurisdiction and business before relying on it.
          </div>

          <div className="prose-like flex flex-col gap-6 text-sm text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">1. Acceptance of terms</h2>
              <p>By creating an account, installing the Windows desktop app, or otherwise using Sign Pdf ("the Service"), you agree to these Terms and Conditions. If you don't agree, please don't use the Service.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">2. The Service</h2>
              <p>Sign Pdf lets you upload PDF documents, place signature/initials/date/text fields, and apply a visual electronic signature (drawn, typed or uploaded) that is flattened into the PDF. Sign Pdf does not currently provide certificate-based (PKI/PAdES) digital signatures.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">3. Your account</h2>
              <p>You're responsible for keeping your login credentials secure and for all activity under your account. Notify us promptly of any unauthorized use.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">4. Your content</h2>
              <p>You retain ownership of any document you upload or sign through Sign Pdf. We only store and process your documents to provide the Service to you — we don't claim any rights over their content.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">5. Acceptable use</h2>
              <p>Don't use Sign Pdf to forge a signature, sign a document without the legal authority to do so, or upload content that is unlawful, infringing, or that you don't have the right to process.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">6. Availability and changes</h2>
              <p>The Service is provided "as is." We may modify, suspend or discontinue features at any time, and we'll do our best to give notice of significant changes.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">7. Limitation of liability</h2>
              <p>To the extent permitted by law, Sign Pdf is not liable for indirect, incidental or consequential damages arising from your use of the Service, including reliance on a signature's legal validity for a particular purpose.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-on-surface mb-2">8. Contact</h2>
              <p>Questions about these terms? Reach out via the Contact us page.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
