import { Link, useLocation } from 'react-router-dom';

const items = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/friends', icon: 'group', label: 'Friends' },
  { path: '/', icon: 'add', label: 'Post', isSpecial: true },
  { path: '/messages', icon: 'chat', label: 'Chat' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 px-4 py-3 flex justify-around items-center z-50">
      {items.map((item) => {
        const isActive = location.pathname === item.path && !item.isSpecial;

        if (item.isSpecial) {
          return (
            <button
              key="special"
              className="story-gradient w-12 h-12 rounded-full flex items-center justify-center text-white -mt-8 border-4 border-surface shadow-lg"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.path + item.label}
            to={item.path}
            className={isActive ? 'text-blue-700' : 'text-outline'}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
