import { useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth, isFirebaseConfigured } from './AuthContext';

export default function Login() {
  const { user, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm text-center flex flex-col gap-3">
          <span className="material-symbols-outlined text-primary text-5xl mx-auto">cloud_off</span>
          <h1 className="text-xl font-bold text-on-surface">Firebase is not configured</h1>
          <p className="text-sm text-on-surface-variant">
            Set the <code>VITE_FIREBASE_*</code> environment variables and redeploy to enable sign in.
          </p>
        </div>
      </div>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(name, email, password);
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">S</div>
          <span className="text-xl font-bold text-on-surface">Sign Pdf</span>
        </Link>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-4">
          <div className="flex gap-2 border-b border-outline-variant">
            <button
              onClick={() => setMode('login')}
              className={`px-3 py-2 text-sm font-semibold border-b-2 ${mode === 'login' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-3 py-2 text-sm font-semibold border-b-2 ${mode === 'signup' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
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
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
