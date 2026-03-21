import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-blue-700">Curator</Link>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-80">
            <span className="material-symbols-outlined text-outline mr-2">search</span>
            <input
              type="text"
              placeholder="Search your world..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline outline-none"
              onFocus={() => navigate('/search')}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-slate-600">notifications</span>
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-slate-600">chat</span>
          </button>

          {/* Profile avatar + dropdown */}
          <div className="relative pl-2 border-l border-outline-variant/20" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="material-symbols-outlined text-slate-500 text-[18px] hidden sm:inline">
                {profileOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/10 py-2 animate-in fade-in z-50">
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-sm font-bold text-on-surface">{user?.name}</p>
                  <p className="text-xs text-on-surface-variant">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  View Profile
                </button>
                {user?.isAdmin && (
                  <button
                    onClick={() => { navigate('/isAdmin'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => { alert('Settings coming soon!'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  Settings
                </button>
                <div className="border-t border-outline-variant/10 mt-1 pt-1">
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger menu for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors lg:hidden"
          >
            <span className="material-symbols-outlined text-slate-600">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 w-72 h-[calc(100vh-56px)] bg-white z-50 shadow-xl lg:hidden flex flex-col p-4 gap-1 animate-in slide-in-from-left overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 px-2 py-3 bg-surface-container-low/50 rounded-xl">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-on-surface">{user?.name}</p>
                <p className="text-xs text-on-surface-variant">{(user as any)?.title || '@curator'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-0.5">
              {[
                { path: '/', icon: 'home', label: 'Home' },
                { path: '/friends', icon: 'group', label: 'Friends' },
                { path: '/messages', icon: 'mail', label: 'Messages' },
                { path: '/notifications', icon: 'notifications', label: 'Notifications' },
                { path: '/profile', icon: 'person', label: 'Profile' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {user?.isAdmin && (
                <button
                  onClick={() => { navigate('/isAdmin'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary hover:bg-primary/5 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  Admin Dashboard
                </button>
              )}
            </nav>

            <div className="mt-auto border-t border-outline-variant/10 pt-3">
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-error hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
