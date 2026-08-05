import { useState, type FormEvent } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebase';
import Seo from './Seo';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!db) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp()
      });
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Seo
        title="Contact us — Sign Pdf"
        description="Questions about signing a PDF, the Sign Pdf web app or the Windows desktop app? Get in touch with the Sign Pdf team."
      />

      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface">Contact us</h1>
            <p className="text-on-surface-variant">
              Question about signing a PDF, a bug, or a feature you'd like to see? Send us a message.
            </p>
          </div>

          {!isFirebaseConfigured ? (
            <p className="text-center text-sm text-error">
              This form isn't connected yet — set the VITE_FIREBASE_* environment variables to enable it.
            </p>
          ) : status === 'sent' ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-5xl">check_circle</span>
              <h2 className="text-lg font-semibold text-on-surface">Message sent</h2>
              <p className="text-sm text-on-surface-variant">Thanks — we'll get back to you by email as soon as we can.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
              />
              {status === 'error' && <p className="text-sm text-error">Something went wrong — please try again.</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="self-start bg-primary text-on-primary font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
