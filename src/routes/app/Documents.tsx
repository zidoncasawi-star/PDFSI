import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { deleteDocument, getShareLink, listenDocuments } from './data';
import type { WebDocument } from '../../types';
import { StatusChip, timeAgo } from './ui';

const PAGE_SIZE = 8;

export default function Documents() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<WebDocument[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return listenDocuments(user.uid, setDocs);
  }, [user]);

  const filtered = useMemo(() => {
    let list = docs.filter((d) => {
      const matchesQ = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || d.status === status;
      return matchesQ && matchesStatus;
    });
    list = list.slice().sort((a, b) => {
      if (sort === 'date-asc') return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
    return list;
  }, [docs, search, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleDelete(d: WebDocument) {
    if (!user) return;
    if (!confirm(`Delete "${d.name}" permanently?`)) return;
    await deleteDocument(user.uid, d);
  }

  async function handleShare(d: WebDocument) {
    try {
      const url = await getShareLink(d.storagePath);

      // Opens the OS/browser share sheet (WhatsApp, Instagram, Mail, etc. —
      // whatever's installed) when available; falls back to copying the
      // link otherwise. Mobile browsers support this near-universally;
      // desktop support varies by browser.
      if (navigator.share) {
        try {
          await navigator.share({ title: d.name, url });
          return;
        } catch (err: any) {
          if (err?.name === 'AbortError') return; // user closed the share sheet
          // fall through to clipboard copy below
        }
      }

      await navigator.clipboard.writeText(url);
      setCopiedId(d.id);
      setTimeout(() => setCopiedId((id) => (id === d.id ? null : id)), 1500);
    } catch {
      alert('Could not create a share link. Check your internet connection and try again.');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-on-surface">Documents</h1>
          <p className="text-on-surface-variant">All documents you've uploaded, prepared or signed.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search documents..."
            className="bg-surface-container-low rounded-lg px-4 py-2 border border-outline-variant focus:border-primary outline-none text-sm w-56"
          />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant text-sm">
            <option value="all">Status: All</option>
            <option value="draft">Status: Draft</option>
            <option value="pending">Status: Pending</option>
            <option value="completed">Status: Completed</option>
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant text-sm">
            <option value="date-desc">Date: Newest first</option>
            <option value="date-asc">Date: Oldest first</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>
        </div>
      </div>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Document Name</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Created</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Last Updated</th>
                <th className="p-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pageItems.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-on-surface-variant">No documents match your search.</td></tr>
              )}
              {pageItems.map((d) => (
                <tr key={d.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <span className="font-medium text-on-surface">{d.name}</span>
                  </td>
                  <td className="p-4"><StatusChip status={d.status} /></td>
                  <td className="p-4 text-on-surface-variant">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-on-surface-variant">{timeAgo(d.updatedAt)}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Link
                      to={`/app/workspace/${d.id}`}
                      className="text-primary text-xs font-semibold border border-primary px-3 py-1.5 rounded-md"
                    >
                      {d.status === 'completed' ? 'Open' : d.status === 'draft' ? 'Prepare' : 'Continue'}
                    </Link>
                    <button
                      onClick={() => handleShare(d)}
                      title="Share"
                      className={`transition-colors p-1 ${copiedId === d.id ? 'text-tertiary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{copiedId === d.id ? 'check' : 'share'}</span>
                    </button>
                    <button onClick={() => handleDelete(d)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-on-surface-variant">
            {filtered.length === 0
              ? 'Showing 0 documents'
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} documents`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="w-8 h-8 rounded-md text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md text-sm font-semibold ${p === currentPage ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {p}
              </button>
            ))}
            <button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="w-8 h-8 rounded-md text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
