import { useEffect, useState } from 'react';
import Topbar from '../../components/Topbar';
import { EMPTY_AD_SETTINGS, saveAdSettings, subscribeAdSettings, type AdSettings } from '../../adSettings';

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

function Field({ label, hint, value, onChange, placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
      />
    </label>
  );
}

export default function AdsPage() {
  const [settings, setSettings] = useState<AdSettings>(EMPTY_AD_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => subscribeAdSettings(setSettings), []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveAdSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Could not save ad settings. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Ads" subtitle="Ad network configuration for the web app, Windows app, and future phone app" />
      <div className="p-6 lg:px-[6%] mx-auto w-full max-w-[900px] flex flex-col gap-6">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Google AdSense</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              The only ad network Google supports on websites. AdMob (below) can't run in a browser or in Electron.
            </p>
          </div>
          <Field
            label="Publisher ID"
            hint="Starts with ca-pub-, from your AdSense account — not the AdMob ca-app-pub- format."
            value={settings.adsenseClientId}
            onChange={(v) => setSettings((s) => ({ ...s, adsenseClientId: v }))}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          />
          <Field
            label="Ad slot ID"
            value={settings.adsenseSlotId}
            onChange={(v) => setSettings((s) => ({ ...s, adsenseSlotId: v }))}
            placeholder="1234567890"
          />
          <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant mt-2">
            <Toggle
              checked={settings.adsenseEnabledWeb}
              onChange={(v) => setSettings((s) => ({ ...s, adsenseEnabledWeb: v }))}
              label="Show on the web app (public marketing pages)"
            />
            <Toggle
              checked={settings.adsenseEnabledWindows}
              onChange={(v) => setSettings((s) => ({ ...s, adsenseEnabledWindows: v }))}
              label="Show in the Windows app"
            />
          </div>
          {settings.adsenseEnabledWindows && (
            <p className="text-xs text-tertiary bg-tertiary-container/10 border border-tertiary/20 rounded-lg px-3 py-2">
              Heads up: AdSense's policies are written for public website content. Showing AdSense ads inside a
              desktop application isn't a typical/approved placement and carries a real risk of account suspension.
            </p>
          )}
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">AdMob (future phone app)</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              AdMob's SDK only runs in a real native Android/iOS build — there's no phone app in this project yet,
              so these IDs aren't used anywhere today. Saved here so they're ready whenever that app exists.
            </p>
          </div>
          <Field
            label="AdMob App ID"
            value={settings.admobAppId}
            onChange={(v) => setSettings((s) => ({ ...s, admobAppId: v }))}
            placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
          />
          <Field
            label="Banner ad unit ID"
            value={settings.admobBannerAdUnitId}
            onChange={(v) => setSettings((s) => ({ ...s, admobBannerAdUnitId: v }))}
            placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
          />
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
