import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc as fsDeleteDoc,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import type { AuditEntry, FieldType, FieldRatio, Signatory, WebDocument, WebField, WebTemplate } from '../../types';

function requireBackend() {
  if (!db || !storage) throw new Error('Firebase is not configured.');
}

const uuid = () => crypto.randomUUID();

// ---------- Documents ----------

export function listenDocuments(uid: string, cb: (docs: WebDocument[]) => void) {
  if (!db) return () => {};
  const q = query(collection(db, 'users', uid, 'documents'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WebDocument, 'id'>) }))));
}

export async function getDocumentBytes(uid: string, storagePath: string): Promise<Uint8Array> {
  requireBackend();
  const bytes = await getBytes(ref(storage!, storagePath));
  return new Uint8Array(bytes);
}

export async function uploadDocument(uid: string, file: File): Promise<WebDocument> {
  requireBackend();
  const id = uuid();
  const storagePath = `users/${uid}/documents/${id}.pdf`;
  await uploadBytes(ref(storage!, storagePath), file, { contentType: 'application/pdf' });

  const record: Omit<WebDocument, 'id'> = {
    name: file.name,
    status: 'draft',
    storagePath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [],
    signatories: []
  };
  await setDoc(doc(db!, 'users', uid, 'documents', id), record);
  await addAuditEntry(uid, { docId: id, docName: file.name, action: 'Document uploaded' });
  return { id, ...record };
}

export async function updateDocumentFields(
  uid: string,
  docId: string,
  fields: WebField[],
  signatories: Signatory[]
) {
  requireBackend();
  await updateDoc(doc(db!, 'users', uid, 'documents', docId), {
    fields,
    signatories,
    status: 'pending',
    updatedAt: new Date().toISOString()
  });
}

export async function completeSign(uid: string, docId: string, storagePath: string, signedBytes: Uint8Array) {
  requireBackend();
  await uploadBytes(ref(storage!, storagePath), signedBytes, { contentType: 'application/pdf' });
  const nowIso = new Date().toISOString();
  await updateDoc(doc(db!, 'users', uid, 'documents', docId), {
    status: 'completed',
    updatedAt: nowIso,
    signedAt: nowIso
  });
}

export async function deleteDocument(uid: string, doc_: WebDocument) {
  requireBackend();
  try {
    await deleteObject(ref(storage!, doc_.storagePath));
  } catch {
    // file may already be gone - ignore
  }
  await fsDeleteDoc(doc(db!, 'users', uid, 'documents', doc_.id));
}

export async function getDocument(uid: string, docId: string): Promise<WebDocument | null> {
  requireBackend();
  const snap = await getDoc(doc(db!, 'users', uid, 'documents', docId));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<WebDocument, 'id'>) }) : null;
}

// ---------- Templates ----------

export function listenTemplates(uid: string, cb: (templates: WebTemplate[]) => void) {
  if (!db) return () => {};
  const q = query(collection(db, 'users', uid, 'templates'), orderBy('lastUsedAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WebTemplate, 'id'>) }))));
}

export async function saveTemplate(
  uid: string,
  name: string,
  fields: { type: FieldType; page: number; ratio: FieldRatio }[]
) {
  requireBackend();
  const id = uuid();
  const nowIso = new Date().toISOString();
  const record: Omit<WebTemplate, 'id'> = { name, fields, createdAt: nowIso, lastUsedAt: nowIso };
  await setDoc(doc(db!, 'users', uid, 'templates', id), record);
  return { id, ...record };
}

export async function touchTemplate(uid: string, templateId: string) {
  requireBackend();
  await updateDoc(doc(db!, 'users', uid, 'templates', templateId), { lastUsedAt: new Date().toISOString() });
}

export async function deleteTemplate(uid: string, templateId: string) {
  requireBackend();
  await fsDeleteDoc(doc(db!, 'users', uid, 'templates', templateId));
}

export async function getTemplate(uid: string, templateId: string): Promise<WebTemplate | null> {
  requireBackend();
  const snap = await getDoc(doc(db!, 'users', uid, 'templates', templateId));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<WebTemplate, 'id'>) }) : null;
}

// ---------- Audit log ----------

export function listenAudit(uid: string, cb: (entries: AuditEntry[]) => void) {
  if (!db) return () => {};
  const q = query(collection(db, 'users', uid, 'auditLog'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AuditEntry, 'id'>) }))));
}

export async function addAuditEntry(uid: string, entry: { docId: string; docName: string; action: string }) {
  requireBackend();
  const id = uuid();
  await setDoc(doc(db!, 'users', uid, 'auditLog', id), {
    ...entry,
    timestamp: new Date().toISOString(),
    serverTimestamp: serverTimestamp()
  });
}
