import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-72 pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
