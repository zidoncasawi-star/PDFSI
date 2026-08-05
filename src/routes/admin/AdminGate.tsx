import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebase';
import { useAuth } from '../app/AuthContext';

// Admin accounts are regular Firebase Auth users whose uid has been added,
// by the project owner, as a document in the `admins` collection (via the
// Firebase console — there is no self-service way to become an admin).
export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, login, logout } = useAuth();
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">S</div>
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
        </form>
      </div>
    </div>
  );
}
