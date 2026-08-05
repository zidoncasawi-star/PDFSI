import { collection, collectionGroup, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import type { WebDocument } from '../../types';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function subscribeContactMessages(cb: (messages: ContactMessage[]) => void) {
  if (!db) return () => {};
  const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }))));
}

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
// admin panel can see activity from all registered users (desktop + web) at once.
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

export interface OwnedAuditEntry {
  id: string;
  ownerUid: string;
  docId: string;
  docName: string;
  action: string;
  timestamp: string;
}

// collectionGroup query across every user's `auditLog` subcollection.
export function subscribeAllAuditEntries(cb: (entries: OwnedAuditEntry[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collectionGroup(db, 'auditLog'), (snap) => {
    const entries = snap.docs.map((d) => ({
      id: d.id,
      ownerUid: d.ref.parent.parent?.id || 'unknown',
      ...(d.data() as Omit<OwnedAuditEntry, 'id' | 'ownerUid'>)
    }));
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    cb(entries);
  });
}

// stats/downloads.count — an increment-only counter bumped by the public
// Download page's "Download now" button (see routes/public/Download.tsx).
export function subscribeDownloadClicks(cb: (count: number) => void) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'stats', 'downloads'), (snap) => {
    cb((snap.data()?.count as number) || 0);
  });
}

export interface InstallRecord {
  deviceId: string;
  platform: string;
  firstSeenAt: string;
  lastSeenAt: string;
  appVersion?: string;
  ownerUid?: string;
}

// One doc per device that has ever launched the Windows app (see
// windows_app's cloud-api.js reportInstall()).
export function subscribeInstalls(cb: (installs: InstallRecord[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'installs'), (snap) => {
    cb(snap.docs.map((d) => ({ deviceId: d.id, ...(d.data() as Omit<InstallRecord, 'deviceId'>) })));
  });
}

export interface PresenceRecord {
  uid: string;
  lastActiveAt: string;
  platform?: string;
}

// Heartbeat docs written every ~25s by any signed-in session (desktop or
// web) while the app is open — see AuthContext.tsx and windows_app's
// shell.js. There's no clean "offline" signal, so the admin dashboard just
// treats a recent lastActiveAt as "currently online".
export function subscribePresence(cb: (records: PresenceRecord[]) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'presence'), (snap) => {
    cb(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<PresenceRecord, 'uid'>) })));
  });
}
