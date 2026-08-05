import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  type User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { PRESENCE_INTERVAL_MS, writePresenceHeartbeat } from './presence';
import { auth, db, isFirebaseConfigured } from '../../firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Presence heartbeat for the admin dashboard's "Online Now" stat — see
  // routes/app/presence.ts and routes/admin/AdminApp.tsx.
  useEffect(() => {
    if (!user) return;
    writePresenceHeartbeat(user.uid);
    const id = setInterval(() => writePresenceHeartbeat(user.uid), PRESENCE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user]);

  const value: AuthContextValue = {
    user,
    loading,
    async login(email, password) {
      if (!auth) throw new Error('Firebase is not configured.');
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signup(name, email, password) {
      if (!auth) throw new Error('Firebase is not configured.');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      // Public-ish profile doc (also the parent of the documents/templates/auditLog
      // subcollections) so the admin panel can list registered web app users.
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), {
          email,
          displayName: name.trim() || null,
          createdAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp()
        });
      }
    },
    async loginWithGoogle() {
      if (!auth || !db) throw new Error('Firebase is not configured.');
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      // Upsert (merge) rather than overwrite, in case this account already has a profile.
      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          email: cred.user.email,
          displayName: cred.user.displayName || null,
          createdAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp()
        },
        { merge: true }
      );
    },
    async logout() {
      if (!auth) return;
      await signOut(auth);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { isFirebaseConfigured };
