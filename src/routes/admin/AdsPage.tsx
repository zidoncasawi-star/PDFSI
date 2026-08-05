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

function Field({ label, hint, value, onChange, placeholder, type = 'text' }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
      />
    </label>
  );
}

function TextArea({ label, hint, value, onChange, placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1 font-mono"
      />
    </label>
  );
}

export default function AdsPage({ onMenuClick }: { onMenuClick?: () => void }) {
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
      <Topbar
        title="Ads"
        subtitle="Ad network configuration for the web app, Windows app, and future phone app"
        onMenuClick={onMenuClick}
      />
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
            <h2 className="text-lg font-semibold text-on-surface">Interstitial (before download / Finish &amp; Sign)</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Shows a modal with an ad and a "Preparing your file…" progress bar right before a document download
              or "Finish &amp; Sign" completes, in both the web app and the Windows app.
            </p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Ad content type</span>
            <select
              value={settings.interstitialType}
              onChange={(e) => setSettings((s) => ({ ...s, interstitialType: e.target.value as AdSettings['interstitialType'] }))}
              className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1"
            >
              <option value="adsense">AdSense</option>
              <option value="html">Custom HTML / ad network code</option>
              <option value="image">Image</option>
            </select>
          </label>

          {settings.interstitialType === 'adsense' && (
            <>
              <Field
                label="Publisher ID"
                value={settings.interstitialAdsenseClientId}
                onChange={(v) => setSettings((s) => ({ ...s, interstitialAdsenseClientId: v }))}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              />
              <Field
                label="Ad slot ID"
                value={settings.interstitialAdsenseSlotId}
                onChange={(v) => setSettings((s) => ({ ...s, interstitialAdsenseSlotId: v }))}
                placeholder="1234567890"
              />
            </>
          )}

          {settings.interstitialType === 'html' && (
            <TextArea
              label="HTML / script"
              hint="Pasted as-is into the modal — e.g. another ad network's tag. Runs with full page privileges, so only paste code from networks you trust."
              value={settings.interstitialHtml}
              onChange={(v) => setSettings((s) => ({ ...s, interstitialHtml: v }))}
              placeholder="<script>...</script> or <div>...</div>"
            />
          )}

          {settings.interstitialType === 'image' && (
            <>
              <Field
                label="Image URL"
                value={settings.interstitialImageUrl}
                onChange={(v) => setSettings((s) => ({ ...s, interstitialImageUrl: v }))}
                placeholder="https://..."
              />
              <Field
                label="Link when clicked (optional)"
                value={settings.interstitialImageLink}
                onChange={(v) => setSettings((s) => ({ ...s, interstitialImageLink: v }))}
                placeholder="https://..."
              />
            </>
          )}

          <Field
            label="Loading message"
            value={settings.interstitialMessage}
            onChange={(v) => setSettings((s) => ({ ...s, interstitialMessage: v }))}
            placeholder="Preparing your file…"
          />
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-on-surface">Duration (seconds)</span>
            <span className="text-xs text-on-surface-variant">How long the modal stays up before the download / sign continues.</span>
            <input
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={settings.interstitialDurationMs / 1000}
              onChange={(e) => setSettings((s) => ({ ...s, interstitialDurationMs: Math.max(1000, Number(e.target.value) * 1000) }))}
              className="bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant focus:border-primary outline-none text-sm mt-1 w-32"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant mt-2">
            <Toggle
              checked={settings.interstitialEnabledWeb}
              onChange={(v) => setSettings((s) => ({ ...s, interstitialEnabledWeb: v }))}
              label="Show in the web app"
            />
            <Toggle
              checked={settings.interstitialEnabledWindows}
              onChange={(v) => setSettings((s) => ({ ...s, interstitialEnabledWindows: v }))}
              label="Show in the Windows app"
            />
          </div>
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
          <Field
            label="Interstitial ad unit ID"
            value={settings.admobInterstitialAdUnitId}
            onChange={(v) => setSettings((s) => ({ ...s, admobInterstitialAdUnitId: v }))}
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
