import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/friends', icon: 'group', label: 'Friends' },
  { path: '/messages', icon: 'mail', label: 'Messages' },
  { path: '/notifications', icon: 'notifications', label: 'Notifications' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="hidden lg:flex flex-col gap-2 p-4 fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-slate-100/50 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6 px-2">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-on-surface">{user.name}</p>
          <p className="text-xs text-on-surface-variant">{(user as any).title || '@curator'}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform active:scale-[0.98] ${
                isActive
                  ? 'text-blue-700 bg-blue-50 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={() => { navigate('/'); window.scrollTo(0, 0); }} 
        className="mt-4 story-gradient text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        Create Post
      </button>

      <div className="mt-auto border-t border-outline-variant/20 pt-4 flex flex-col gap-1">
        <button onClick={() => alert('Settings coming soon!')} className="flex w-full items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm">Settings</span>
        </button>
        <button onClick={() => alert('Help Center coming soon!')} className="flex w-full items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-sm">Help</span>
        </button>
      </div>
    </aside>
  );
}
