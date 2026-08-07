import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { listenDocuments } from './data';
import type { WebDocument } from '../../types';
import { StatusChip, timeAgo } from './ui';

export default function Dashboard() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<WebDocument[]>([]);

  useEffect(() => {
    if (!user) return;
    return listenDocuments(user.uid, setDocs);
  }, [user]);

  const stats = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return {
      pending: docs.filter((d) => d.status === 'pending').length,
      completed30d: docs.filter((d) => d.status === 'completed' && d.signedAt && now - new Date(d.signedAt).getTime() <= thirtyDays).length,
      drafts: docs.filter((d) => d.status === 'draft').length
    };
  }, [docs]);

  const needsAttention = docs.filter((d) => d.status === 'draft' || d.status === 'pending').slice(0, 8);
  const recent = docs.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-on-surface">Overview</h1>
        <p className="text-on-surface-variant">Track your document statuses and recent activity.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Pending Signatures" value={stats.pending} icon="hourglass_empty" />
        <StatCard label="Signed (Last 30 Days)" value={stats.completed30d} icon="task_alt" />
        <StatCard label="Drafts" value={stats.drafts} icon="draft" />
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Needs Attention</h2>
          <Link to="/app/documents" className="text-primary text-sm font-semibold">View All</Link>
        </div>
        {needsAttention.length === 0 ? (
          <p className="text-sm text-on-surface-variant">Nothing needs attention right now.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {needsAttention.map((d) => (
              <Link
                key={d.id}
                to={`/app/workspace/${d.id}`}
                className="flex-shrink-0 w-[260px] flex items-start gap-3 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary mt-0.5">edit_document</span>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-on-surface truncate">{d.name}</span>
                  <span className="text-xs text-on-surface-variant">{d.status === 'draft' ? 'Needs fields prepared' : 'Awaiting signature'}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-lg font-semibold text-on-surface">Recent Activity</h2>
          <Link to="/app/documents" className="text-primary text-sm font-semibold">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Document</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recent.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-on-surface-variant">
                    No documents yet. <Link to="/app/upload" className="text-primary">Upload your first document</Link>.
                  </td>
                </tr>
              )}
              {recent.map((d) => (
                <tr key={d.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <Link to={`/app/workspace/${d.id}`} className="font-medium text-on-surface hover:text-primary">{d.name}</Link>
                  </td>
                  <td className="p-4"><StatusChip status={d.status} /></td>
                  <td className="p-4 text-on-surface-variant">{timeAgo(d.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 shadow-sm relative overflow-hidden flex items-center justify-between gap-3">
      <div className="flex flex-col z-10 relative min-w-0">
        <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider truncate">{label}</span>
        <span className="text-2xl font-bold text-on-surface">{value}</span>
      </div>
      <span className="material-symbols-outlined text-2xl text-primary opacity-30 flex-shrink-0">{icon}</span>
    </div>
  );
}
