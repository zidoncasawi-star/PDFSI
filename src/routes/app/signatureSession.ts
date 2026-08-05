import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export interface SignatureSession {
  status: 'pending' | 'completed';
  dataUrl: string | null;
  createdBy: string;
}

export async function createSignatureSession(uid: string): Promise<string> {
  if (!db) throw new Error('Firebase is not configured.');
  const sessionId = crypto.randomUUID();
  await setDoc(doc(db, 'signatureSessions', sessionId), {
    status: 'pending',
    dataUrl: null,
    createdBy: uid,
    createdAt: serverTimestamp()
  });
  return sessionId;
}

export function subscribeSignatureSession(sessionId: string, cb: (session: SignatureSession | null) => void) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'signatureSessions', sessionId), (snap) => {
    cb(snap.exists() ? (snap.data() as SignatureSession) : null);
  });
}

// Note: `createdBy` is deliberately left untouched by this update — Firestore's
// update() merges fields, so the security rule's check that createdBy is
// unchanged is satisfied automatically without the (unauthenticated) phone
// page needing to know or resubmit it.
export async function completeSignatureSession(sessionId: string, dataUrl: string) {
  if (!db) throw new Error('Firebase is not configured.');
  await updateDoc(doc(db, 'signatureSessions', sessionId), {
    status: 'completed',
    dataUrl,
    completedAt: serverTimestamp()
  });
}

export async function deleteSignatureSession(sessionId: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'signatureSessions', sessionId));
  } catch {
    // best-effort cleanup
  }
}
