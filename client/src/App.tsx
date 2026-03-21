import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/register" replace />;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();

  console.log('[AdminRoute] loading:', loading, 'user:', user);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[AdminRoute] No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('[AdminRoute] user.isAdmin =', user.isAdmin);

  if (user.isAdmin) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Auth pages (standalone layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main app pages (with Navbar + Sidebar layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Admin specific pages */}
      <Route element={<AdminRoute />}>
        <Route path="/isAdmin" element={<AdminDashboard />} />
      </Route>

      {/* Default redirect - Force users to create an account first initially */}
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  )
}

export default App
