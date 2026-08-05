import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { deleteTemplate, listenTemplates } from './data';
import type { WebTemplate } from '../../types';
import { timeAgo } from './ui';

export default function Templates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WebTemplate[]>([]);

  useEffect(() => {
    if (!user) return;
    return listenTemplates(user.uid, setTemplates);
  }, [user]);

  async function handleDelete(id: string) {
    if (!user) return;
    if (!confirm('Delete this template?')) return;
    await deleteTemplate(user.uid, id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-on-surface">Templates</h1>
        <p className="text-on-surface-variant">
          Reusable field layouts. Save one from any document's Signing Workspace, then apply it to new uploads in
          one click.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 && (
          <p className="text-sm text-on-surface-variant">No templates yet. Open a document's Signing Workspace and click "Save as Template".</p>
        )}
        {templates.map((t) => {
          const counts: Record<string, number> = {};
          t.fields.forEach((f) => { counts[f.type] = (counts[f.type] || 0) + 1; });
          const summary = Object.entries(counts).map(([type, n]) => `${n} ${type}`).join(', ') || 'No fields saved';
          return (
            <div key={t.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">style</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-on-surface truncate">{t.name}</span>
                  <span className="text-xs text-on-surface-variant">Last used {timeAgo(t.lastUsedAt)}</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">{summary}</p>
              <div className="flex gap-2 mt-auto">
                <Link to={`/app/upload?template=${t.id}`} className="flex-1 text-center bg-primary text-on-primary text-sm font-semibold px-3 py-2 rounded-md hover:opacity-90">
                  Use Template
                </Link>
                <button onClick={() => handleDelete(t.id)} className="text-on-surface-variant hover:text-error transition-colors p-2">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
