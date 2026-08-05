interface Props {
  active: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { key: 'overview', label: 'Dashboard', icon: 'dashboard' },
  { key: 'documents', label: 'Documents', icon: 'description' },
  { key: 'webusers', label: 'Users', icon: 'group' },
  { key: 'messages', label: 'Contact Messages', icon: 'mail' },
  { key: 'audit', label: 'Audit Logs', icon: 'history' },
  { key: 'ads', label: 'Ads', icon: 'ads_click' },
  { key: 'appUpdate', label: 'App Update', icon: 'system_update' }
];

export function SidebarContent({ active, onNavigate }: Props) {
  return (
    <>
      <div className="p-gutter flex items-center gap-3">
        <img src="/icon.png" alt="Sign Pdf" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary">Sign Pdf</span>
          <span className="text-xs text-on-surface-variant">Admin Dashboard</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200 text-left ${
              active === item.key
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto px-2 py-4 flex flex-col gap-1 border-t border-outline-variant">
        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all text-left ${
            active === 'settings'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-semibold">Connection</span>
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside className="bg-surface-container-low h-screen w-64 flex-col border-r border-outline-variant fixed left-0 top-0 z-40 hidden md:flex">
      <SidebarContent active={active} onNavigate={onNavigate} />
    </aside>
  );
}
