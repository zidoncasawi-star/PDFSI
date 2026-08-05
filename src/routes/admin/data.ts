import { collection, collectionGroup, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import type { WebDocument } from '../../types';

export interface WebUserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export function subscribeWebUsers(cb: (users: WebUserProfile[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'users'), (snap) => {
    cb(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<WebUserProfile, 'uid'>) })));
  });
}

export interface WebUserDocument extends WebDocument {
  ownerUid: string;
}

// collectionGroup query across every user's `documents` subcollection, so the
// admin panel can see activity from all registered /app web users at once.
export function subscribeAllWebDocuments(cb: (docs: WebUserDocument[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collectionGroup(db, 'documents'), (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        ownerUid: d.ref.parent.parent?.id || 'unknown',
        ...(d.data() as Omit<WebDocument, 'id'>)
      }))
    );
  });
}
