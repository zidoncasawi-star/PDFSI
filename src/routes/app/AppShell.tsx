import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/app/documents', label: 'Documents', icon: 'description' },
  { to: '/app/templates', label: 'Templates', icon: 'style' },
  { to: '/app/upload', label: 'New Document', icon: 'upload_file' }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/app/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="bg-surface-container-low h-screen w-64 flex flex-col border-r border-outline-variant fixed left-0 top-0 z-40 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold flex-shrink-0">S</div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">Sign Pdf</span>
            <span className="text-xs text-on-surface-variant">Web App</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-2 py-4 flex flex-col gap-1 border-t border-outline-variant">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all ${
                isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-semibold">Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-semibold">Log out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-surface/95 backdrop-blur-sm w-full h-16 flex items-center justify-between px-6 sticky top-0 z-30 border-b border-outline-variant">
          <span className="text-sm text-on-surface-variant md:hidden font-bold text-primary">Sign Pdf</span>
          <NavLink to="/app/upload" className="ml-auto bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Document
          </NavLink>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-semibold ml-4">
            {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
          </div>
        </header>
        <div className="flex-1 p-6 md:p-10 mx-auto w-full max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
