import { useEffect, useState } from 'react';
import Topbar from '../../components/Topbar';
import { EMPTY_APP_VERSION_SETTINGS, saveAppVersionSettings, subscribeAppVersionSettings, type AppVersionSettings } from '../../appVersionSettings';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-outline-variant'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-sm text-on-surface">{label}</span>
    </label>
  );
}

export default function AppUpdatePage({ onMenuClick }: { onMenuClick?: () => void }) {
  const [settings, setSettings] = useState<AppVersionSettings>(EMPTY_APP_VERSION_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => subscribeAppVersionSettings(setSettings), []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveAppVersionSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Could not save. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Windows App Update" subtitle="Control which desktop app version is required" onMenuClick={onMenuClick} />
      <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[900px] flex flex-col gap-6">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant">
            The desktop app checks this on every launch (even before sign-in). When the installed version is older
            than the version below, it shows an update screen — non-dismissable when "Force update" is on — with a
            button that downloads the new installer and launches it.
          </p>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Latest version</span>
            <span className="text-xs text-on-surface-variant">Must match windows_app/package.json's "version" field exactly, e.g. 1.1.0.</span>
            <input
              value={settings.latestVersion}
              onChange={(e) => setSettings((s) => ({ ...s, latestVersion: e.target.value }))}
              placeholder="1.1.0"
              className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Installer download URL</span>
            <span className="text-xs text-on-surface-variant">Direct link to the new .exe (e.g. a GitHub Releases asset).</span>
            <input
              value={settings.downloadUrl}
              onChange={(e) => setSettings((s) => ({ ...s, downloadUrl: e.target.value }))}
              placeholder="https://github.com/.../Sign-Pdf-Setup-1.1.0.exe"
              className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Release notes (optional)</span>
            <textarea
              value={settings.releaseNotes}
              onChange={(e) => setSettings((s) => ({ ...s, releaseNotes: e.target.value }))}
              rows={4}
              placeholder="What's new in this version…"
              className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
            />
          </label>

          <div className="pt-2 border-t border-outline-variant mt-2">
            <Toggle
              checked={settings.forceUpdate}
              onChange={(v) => setSettings((s) => ({ ...s, forceUpdate: v }))}
              label="Force update (blocks the app entirely until updated)"
            />
            {!settings.forceUpdate && (
              <p className="text-xs text-on-surface-variant mt-2">
                Off: users just see a dismissable "update available" banner instead.
              </p>
            )}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-tertiary">Saved.</span>}
        </div>
      </div>
    </>
  );
}
