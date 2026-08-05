import { useEffect, useMemo, useState } from 'react';
import Sidebar, { SidebarContent } from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import AdsPage from './AdsPage';
import { isFirebaseConfigured } from '../../firebase';
import {
  subscribeAllAuditEntries,
  subscribeAllWebDocuments,
  subscribeContactMessages,
  subscribeDownloadClicks,
  subscribeInstalls,
  subscribePresence,
  subscribeWebUsers,
  type ContactMessage,
  type InstallRecord,
  type OwnedAuditEntry,
  type PresenceRecord,
  type WebUserDocument,
  type WebUserProfile
} from './data';

// A heartbeat older than this is considered stale — see the presence
// heartbeat writers in AuthContext.tsx (web) and shell.js (desktop), both
// of which write roughly every 25s.
const ONLINE_THRESHOLD_MS = 75_000;

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [webUsers, setWebUsers] = useState<WebUserProfile[]>([]);
  const [webDocuments, setWebDocuments] = useState<WebUserDocument[]>([]);
  const [auditEntries, setAuditEntries] = useState<OwnedAuditEntry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [downloadClicks, setDownloadClicks] = useState(0);
  const [installs, setInstalls] = useState<InstallRecord[]>([]);
  const [presence, setPresence] = useState<PresenceRecord[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubUsers = subscribeWebUsers(setWebUsers);
    const unsubDocs = subscribeAllWebDocuments(setWebDocuments);
    const unsubAudit = subscribeAllAuditEntries(setAuditEntries);
    const unsubMessages = subscribeContactMessages(setMessages);
    const unsubDownloads = subscribeDownloadClicks(setDownloadClicks);
    const unsubInstalls = subscribeInstalls(setInstalls);
    const unsubPresence = subscribePresence(setPresence);
    return () => {
      unsubUsers();
      unsubDocs();
      unsubAudit();
      unsubMessages();
      unsubDownloads();
      unsubInstalls();
      unsubPresence();
    };
  }, []);

  // Presence docs only change on the writers' ~25s cadence, but a user can
  // go stale (tab closed, app killed) without any new write ever arriving —
  // so re-check "now" on a timer too, not just on snapshot updates.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const onlineCount = useMemo(
    () => presence.filter((p) => now - new Date(p.lastActiveAt).getTime() <= ONLINE_THRESHOLD_MS).length,
    [presence, now]
  );

  const userNameByUid = useMemo(() => {
    const map: Record<string, string> = {};
    webUsers.forEach((u) => { map[u.uid] = u.displayName || u.email; });
    return map;
  }, [webUsers]);

  const totals = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return {
      pending: webDocuments.filter((d) => d.status === 'pending').length,
      completed30d: webDocuments.filter((d) => d.status === 'completed' && d.signedAt && now - new Date(d.signedAt).getTime() <= thirtyDays).length,
      drafts: webDocuments.filter((d) => d.status === 'draft').length
    };
  }, [webDocuments]);

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

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="relative bg-surface-container-low w-72 max-w-[80vw] h-full flex flex-col border-r border-outline-variant">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <SidebarContent active={page} onNavigate={(p) => { setPage(p); setMenuOpen(false); }} />
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {page === 'overview' && (
          <>
            <Topbar
              title="Overview"
              subtitle="Live data from every signed-in user (desktop app + web app)"
              onMenuClick={() => setMenuOpen(true)}
            />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px] flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={webUsers.length} icon="group" tone="primary" />
                <StatCard label="Online Now" value={onlineCount} icon="wifi" tone="tertiary" />
                <StatCard label="Installs" value={installs.length} icon="desktop_windows" tone="secondary" />
                <StatCard label="Download Clicks" value={downloadClicks} icon="download" tone="primary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Pending Signatures" value={totals.pending} icon="hourglass_empty" tone="tertiary" />
                <StatCard label="Completed (30d)" value={totals.completed30d} icon="task_alt" tone="primary" />
                <StatCard label="Drafts" value={totals.drafts} icon="draft" tone="secondary" />
              </div>
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant">
                  <h2 className="text-lg font-semibold text-on-surface">Recent Activity</h2>
                </div>
                <AuditTable entries={auditEntries.slice(0, 8)} userNameByUid={userNameByUid} />
              </section>
            </div>
          </>
        )}

        {page === 'documents' && (
          <>
            <Topbar title="Documents" subtitle="Across every signed-in user" onMenuClick={() => setMenuOpen(true)} />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px]">
              <DocumentsTable documents={webDocuments} userNameByUid={userNameByUid} />
            </div>
          </>
        )}

        {page === 'webusers' && (
          <>
            <Topbar title="Users" subtitle="Everyone signed up, from the desktop app or the web app" onMenuClick={() => setMenuOpen(true)} />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-4">
              {webUsers.length === 0 && (
                <p className="text-sm text-on-surface-variant">No users have signed up yet.</p>
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

        {page === 'messages' && (
          <>
            <Topbar title="Contact Messages" subtitle="Submissions from the public Contact us page" onMenuClick={() => setMenuOpen(true)} />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1000px] flex flex-col gap-4">
              {messages.length === 0 && <p className="text-sm text-on-surface-variant">No messages yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-on-surface text-sm">{m.name}</p>
                      <p className="text-xs text-on-surface-variant">{m.email}</p>
                    </div>
                    <span className="text-xs text-on-surface-variant whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-on-surface whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'audit' && (
          <>
            <Topbar title="Audit Logs" subtitle="Every signing action, across every user" onMenuClick={() => setMenuOpen(true)} />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[1400px]">
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                <AuditTable entries={auditEntries} userNameByUid={userNameByUid} />
              </section>
            </div>
          </>
        )}

        {page === 'ads' && <AdsPage onMenuClick={() => setMenuOpen(true)} />}

        {page === 'settings' && (
          <>
            <Topbar title="Connection" subtitle="How this dashboard fits into the Sign Pdf project" onMenuClick={() => setMenuOpen(true)} />
            <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[800px] flex flex-col gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-on-surface">Firebase project</h2>
                <p className="text-sm text-on-surface-variant">
                  This dashboard reads the <code>users/&#123;uid&#125;</code> collection tree, written to by both
                  the desktop app and the web app — every user must be signed in on both, there is no offline or
                  anonymous mode. To make an account an admin, add a document at <code>admins/&#123;uid&#125;</code>{' '}
                  in the Firebase console (see the project README).
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DocumentsTable({ documents, userNameByUid }: { documents: WebUserDocument[]; userNameByUid: Record<string, string> }) {
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
                  No documents yet.
                </td>
              </tr>
            )}
            {documents.map((d) => (
              <tr key={`${d.ownerUid}-${d.id}`} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                  </div>
                  <span className="font-medium text-on-surface">{d.name}</span>
                </td>
                <td className="p-4 text-on-surface-variant">{userNameByUid[d.ownerUid] || d.ownerUid}</td>
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

function AuditTable({ entries, userNameByUid }: { entries: OwnedAuditEntry[]; userNameByUid: Record<string, string> }) {
  return (
    <div className="divide-y divide-outline-variant">
      {entries.length === 0 && <p className="p-6 text-center text-on-surface-variant text-sm">No activity yet.</p>}
      {entries.map((e) => (
        <div key={`${e.ownerUid}-${e.id}`} className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-on-surface">
              <strong>{userNameByUid[e.ownerUid] || e.ownerUid}</strong> — {e.action}
            </span>
            <span className="text-xs text-on-surface-variant">{e.docName}</span>
          </div>
          <span className="text-xs text-on-surface-variant whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
