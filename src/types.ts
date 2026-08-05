export type DocStatus = 'draft' | 'pending' | 'completed';

export interface DocRecord {
  id: string;
  name: string;
  status: DocStatus;
  createdAt: string;
  updatedAt: string;
  signedAt?: string | null;
}

export interface AuditEntry {
  id: string;
  docId: string;
  docName: string;
  action: string;
  timestamp: string;
}

export interface DeviceStats {
  pending: number;
  completed30d: number;
  drafts: number;
  total: number;
}

export interface DeviceDoc {
  userName: string;
  stats: DeviceStats;
  documents: DocRecord[];
  auditLog: AuditEntry[];
  updatedAt: unknown;
}

// ---------- /app (web signing app) ----------

export type FieldType = 'signature' | 'initials' | 'date' | 'text';

export interface Signatory {
  id: string;
  name: string;
  color: string;
}

export interface FieldRatio {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WebField {
  id: string;
  type: FieldType;
  page: number;
  signatoryId: string;
  ratio: FieldRatio;
  dataUrl?: string | null;
  text?: string | null;
}

export interface WebDocument {
  id: string;
  name: string;
  status: DocStatus;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
  signedAt?: string | null;
  fields: WebField[];
  signatories: Signatory[];
}

export interface WebTemplate {
  id: string;
  name: string;
  fields: { type: FieldType; page: number; ratio: FieldRatio }[];
  createdAt: string;
  lastUsedAt: string;
}
