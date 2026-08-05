import { useState, type FormEvent } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from './AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [saved, setSaved] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    await updateProfile(user, { displayName: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6 max-w-[700px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-on-surface">Settings</h1>
        <p className="text-on-surface-variant">Manage your profile.</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-on-surface">Profile</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-on-surface-variant">Display name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-outline-variant rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-on-surface-variant">Email</span>
          <input value={user?.email || ''} disabled className="border border-outline-variant rounded-lg px-4 py-3 text-sm bg-surface-container-low text-on-surface-variant" />
        </label>
        <button type="submit" className="self-start bg-primary text-on-primary text-sm font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Save Settings
        </button>
        {saved && <p className="text-tertiary text-sm">Saved.</p>}
      </form>
    </div>
  );
}
