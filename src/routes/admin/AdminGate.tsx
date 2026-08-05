import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebase';
import { useAuth } from '../app/AuthContext';

// Admin accounts are regular Firebase Auth users whose uid has been added,
// by the project owner, as a document in the `admins` collection (via the
// Firebase console — there is no self-service way to become an admin).
export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, login, loginWithGoogle, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || !db) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    getDoc(doc(db, 'admins', user.uid))
      .then((snap) => setIsAdmin(snap.exists()))
      .finally(() => setChecking(false));
  }, [user, loading]);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm text-center flex flex-col gap-3">
          <span className="material-symbols-outlined text-primary text-5xl mx-auto">cloud_off</span>
          <h1 className="text-xl font-bold text-on-surface">Firebase is not configured</h1>
          <p className="text-sm text-on-surface-variant">
            Set the <code>VITE_FIREBASE_*</code> environment variables and redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (user && isAdmin) return <>{children}</>;

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm text-center flex flex-col gap-3">
          <span className="material-symbols-outlined text-error text-5xl mx-auto">block</span>
          <h1 className="text-xl font-bold text-on-surface">Not an admin account</h1>
          <p className="text-sm text-on-surface-variant">
            {user.email} is signed in but isn't listed in the <code>admins</code> collection.
          </p>
          <button onClick={() => logout()} className="self-center text-primary text-sm font-semibold mt-2">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message?.replace('Firebase: ', '') || 'Something went wrong.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <img src="/icon.png" alt="Sign Pdf" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-xl font-bold text-on-surface">Sign Pdf Admin</span>
        </div>
        <form onSubmit={submit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="bg-primary text-on-primary font-semibold text-sm px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy ? 'Please wait…' : 'Sign in'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-sm text-on-surface-variant">or</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="border border-outline-variant text-on-surface font-semibold text-sm px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
