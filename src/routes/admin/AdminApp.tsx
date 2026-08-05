import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import { isFirebaseConfigured, subscribeToDevices } from '../../firebase';
import { subscribeAllWebDocuments, subscribeWebUsers, type WebUserDocument, type WebUserProfile } from './data';
import type { AuditEntry, DeviceDoc, DocRecord } from '../../types';

type Device = DeviceDoc & { deviceId: string };

const statusStyles: Record<string, string> = {
  draft: 'bg-surface-container-highest text-on-surface-variant',
  pending: 'bg-secondary-container text-on-secondary-container',
  completed: 'bg-tertiary-container/20 text-tertiary border border-tertiary/20'
};

function StatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminApp() {
  const [page, setPage] = useState('overview');
  const [devices, setDevices] = useState<Device[]>([]);
  const [webUsers, setWebUsers] = useState<WebUserProfile[]>([]);
  const [webDocuments, setWebDocuments] = useState<WebUserDocument[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubDevices = subscribeToDevices(setDevices);
    const unsubUsers = subscribeWebUsers(setWebUsers);
    const unsubDocs = subscribeAllWebDocuments(setWebDocuments);
    return () => {
      unsubDevices();
      unsubUsers();
      unsubDocs();
    };
  }, []);

  const allDocuments = useMemo(
    () =>
      devices.flatMap((d) =>
        (d.documents || []).map((doc) => ({ ...doc, deviceId: d.deviceId, userName: d.userName }))
      ),
    [devices]
  );

  const allAudit = useMemo(
    () =>
      devices
        .flatMap((d) => (d.auditLog || []).map((a) => ({ ...a, deviceId: d.deviceId, userName: d.userName })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [devices]
  );

  const totals = useMemo(
    () =>
      devices.reduce(
        (acc, d) => ({
          pending: acc.pending + (d.stats?.pending || 0),
          completed30d: acc.completed30d + (d.stats?.completed30d || 0),
          drafts: acc.drafts + (d.stats?.drafts || 0)
        }),
        { pending: 0, completed30d: 0, drafts: 0 }
      ),
    [devices]
  );

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm text-center flex flex-col gap-3">
          <span className="material-symbols-outlined text-primary text-5xl mx-auto">cloud_off</span>
          <h1 className="text-xl font-bold text-on-surface">Firebase is not configured</h1>
          <p className="text-sm text-on-surface-variant">
            Set the <code>VITE_FIREBASE_*</code> environment variables (see <code>.env.example</code>) to the same
            Firebase project used by the Sign Pdf apps (desktop or web), then redeploy. In AI Studio, add these as
            project secrets/environment variables before publishing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {page === 'overview' && (
          <>
            <Topbar title="Overview" subtitle="Live data from the Sign Pdf desktop app and web app" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px] flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Pending Signatures" value={totals.pending} icon="hourglass_empty" tone="tertiary" />
                <StatCard label="Completed (30d)" value={totals.completed30d} icon="task_alt" tone="primary" />
                <StatCard label="Drafts" value={totals.drafts} icon="draft" tone="secondary" />
              </div>
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant">
                  <h2 className="text-lg font-semibold text-on-surface">Recent Activity</h2>
                </div>
                <AuditTable entries={allAudit.slice(0, 8)} />
              </section>
            </div>
          </>
        )}

        {page === 'documents' && (
          <>
            <Topbar title="Documents" subtitle="Across all connected devices" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px]">
              <DocumentsTable documents={allDocuments} />
            </div>
          </>
        )}

        {page === 'devices' && (
          <>
            <Topbar title="Devices" subtitle="Sign Pdf desktop installations linked to this project" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.length === 0 && (
                <p className="text-sm text-on-surface-variant">
                  No devices connected yet. Enable Firebase sync in the desktop app's Settings page.
                </p>
              )}
              {devices.map((d) => (
                <div key={d.deviceId} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">computer</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface text-sm">{d.userName || 'Unnamed device'}</p>
                      <p className="text-xs text-on-surface-variant">{d.deviceId}</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">{(d.documents || []).length} documents synced</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'webusers' && (
          <>
            <Topbar title="Web App Users" subtitle="Everyone signed up at /app, with their documents" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-4">
              {webUsers.length === 0 && (
                <p className="text-sm text-on-surface-variant">No web app users have signed up yet.</p>
              )}
              {webUsers.map((u) => {
                const docs = webDocuments.filter((d) => d.ownerUid === u.uid);
                return (
                  <div key={u.uid} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{u.displayName || u.email}</p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      {docs.length} documents · {docs.filter((d) => d.status === 'completed').length} completed
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {page === 'audit' && (
          <>
            <Topbar title="Audit Logs" subtitle="Every signing action, across every device" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px]">
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <AuditTable entries={allAudit} />
              </section>
            </div>
          </>
        )}

        {page === 'settings' && (
          <>
            <Topbar title="Connection" subtitle="How this dashboard links to the desktop app" />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[800px] flex flex-col gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-on-surface">Firebase project</h2>
                <p className="text-sm text-on-surface-variant">
                  This dashboard reads the <code>lexissign_devices</code> Firestore collection. Open the Sign Pdf
                  desktop app, go to <strong>Settings</strong>, paste the same Firebase config used here, and enable
                  sync. New devices will appear automatically under "Devices".
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DocumentsTable({ documents }: { documents: (DocRecord & { deviceId: string; userName: string })[] }) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Document</th>
              <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Owner</th>
              <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Updated</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-on-surface-variant">
                  No documents synced yet.
                </td>
              </tr>
            )}
            {documents.map((d) => (
              <tr key={`${d.deviceId}-${d.id}`} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <span className="font-medium text-on-surface">{d.name}</span>
                </td>
                <td className="p-4 text-on-surface-variant">{d.userName}</td>
                <td className="p-4">
                  <StatusChip status={d.status} />
                </td>
                <td className="p-4 text-on-surface-variant">{new Date(d.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AuditTable({ entries }: { entries: (AuditEntry & { deviceId: string; userName: string })[] }) {
  return (
    <div className="divide-y divide-outline-variant">
      {entries.length === 0 && <p className="p-6 text-center text-on-surface-variant text-sm">No activity yet.</p>}
      {entries.map((e) => (
        <div key={`${e.deviceId}-${e.id}`} className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-on-surface">
              <strong>{e.userName}</strong> — {e.action}
            </span>
            <span className="text-xs text-on-surface-variant">{e.docName}</span>
          </div>
          <span className="text-xs text-on-surface-variant whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
