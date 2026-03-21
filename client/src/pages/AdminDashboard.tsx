import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface DashboardStats {
  totalUsers: number;
  postsToday: number;
  flaggedContent: number;
  resolvedIssues: number;
  userGrowthPercent: number;
  postsGrowthPercent: number;
}

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  isBanned: boolean;
  isAdmin: boolean;
  flags: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // User list state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all'|'active'|'restricted'|'banned'>('all');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats({
        ...statsRes.data,
        flaggedContent: 184,
        resolvedIssues: 1204,
        postsGrowthPercent: 4.2,
      });
      setUsers(
        usersRes.data.map((u: any) => ({
          ...u,
          flags: Math.floor(Math.random() * 5),
        }))
      );
    } catch (err: any) {
      console.error('Failed loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleBan = async (userId: string) => {
    if (userId === user?._id) return;
    try {
      const { data } = await api.put(`/admin/users/${userId}/ban`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: data.isBanned } : u))
      );
    } catch (err) {
      console.error('Ban toggle failed', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'active') matchesFilter = !u.isBanned && u.flags <= 1;
    if (filterStatus === 'restricted') matchesFilter = !u.isBanned && u.flags > 1;
    if (filterStatus === 'banned') matchesFilter = u.isBanned;

    return matchesSearch && matchesFilter;
  });

  if (!user) return null;

  return (
    <div className="bg-[#f0f2f5] text-[#1c1e21] min-h-screen font-sans">
      <div className="flex">
        {/* ═══════════════ Sidebar ═══════════════ */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 mb-6 mt-2">
            <span
              className="text-2xl font-extrabold tracking-tight text-blue-600 cursor-pointer select-none"
              onClick={() => navigate('/')}
            >
              Curator
            </span>
          </div>

          {/* Profile Card */}
          <div className="px-4 mb-8">
            <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-[11px] font-medium text-gray-500">Digital Curator</p>
                </div>
              </div>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                Generate Report
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-3 flex-1 font-medium overflow-y-auto">
            <SidebarBtn
              icon="dashboard"
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <SidebarBtn
              icon="flag"
              label="Content Flags"
              active={activeTab === 'flags'}
              onClick={() => setActiveTab('flags')}
              badge="24"
              badgeColor="bg-[#d32f2f] text-white"
            />
            <SidebarBtn
              icon="group"
              label="User Accounts"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
            <SidebarBtn
              icon="history"
              label="Audit Log"
              active={activeTab === 'audit'}
              onClick={() => setActiveTab('audit')}
            />
          </nav>

          <div className="p-4 mb-2 flex flex-col gap-1 font-medium border-t border-gray-100">
            <SidebarBtn
              icon="settings"
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
            <SidebarBtn
              icon="logout"
              label="Sign Out"
              active={false}
              onClick={logout}
            />
          </div>
        </aside>

        {/* ═══════════════ Main Content ═══════════════ */}
        <main className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center bg-[#f0f2f5] px-4 py-2.5 rounded-full w-[400px]">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search moderation logs..."
                className="bg-transparent border-none text-sm w-full outline-none text-gray-700 placeholder:text-gray-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-5">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </button>

              <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold">Head Moderator</p>
                </div>
                <img
                  alt="Admin"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                  src={user.avatar}
                />
              </div>
            </div>
          </header>

          {/* Dashboard Content Dynamic Routing */}
          <div className="p-8 max-w-[1200px] w-full mx-auto space-y-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* ─── TAB: DASHBOARD ─── */}
                {activeTab === 'dashboard' && (
                  <>
                    <div className="grid grid-cols-4 gap-6">
                      {/* Stats cards same as before */}
                      <StatCard
                        title="Total Users"
                        value={(stats?.totalUsers || 0).toLocaleString()}
                        icon="person"
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                        badge={`${stats?.userGrowthPercent >= 0 ? '+' : ''}${
                          stats?.userGrowthPercent
                        }%`}
                        badgeColor="text-green-700 bg-green-50"
                      />
                      <StatCard
                        title="Posts Today"
                        value={(stats?.postsToday || 0).toLocaleString()}
                        icon="post_add"
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                        badge="+4.2k"
                        badgeColor="text-green-700 bg-green-50"
                      />
                      <StatCard
                        title="Flagged Content"
                        value={stats?.flaggedContent || 184}
                        icon="flag"
                        iconColor="text-red-600"
                        iconBg="bg-red-50"
                        badge="Critical"
                        badgeColor="text-[#d32f2f] bg-red-50"
                      />
                      <StatCard
                        title="Resolved Issues"
                        value={(stats?.resolvedIssues || 1204).toLocaleString()}
                        icon="check_circle"
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                        badge="92%"
                        badgeColor="text-gray-600 bg-gray-100"
                      />
                    </div>

                    <div className="grid grid-cols-[2fr_1fr] gap-8">
                      {/* Queue Overview */}
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <h2 className="text-xl font-bold text-gray-900">
                            Queue: High Priority Flags
                          </h2>
                          <button
                            onClick={() => setActiveTab('flags')}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            View Full Queue{' '}
                            <span className="material-symbols-outlined text-[16px]">
                              arrow_forward
                            </span>
                          </button>
                        </div>
                        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-2">
                          <HighPriorityQueue />
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Recent Activity
                        </h2>
                        <RecentActivityFeed />
                      </div>
                    </div>
                  </>
                )}

                {/* ─── TAB: CONTENT FLAGS ─── */}
                {activeTab === 'flags' && (
                  <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-6 min-h-[500px]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderation Queue</h2>
                    <HighPriorityQueue full />
                  </div>
                )}

                {/* ─── TAB: USER ACCOUNTS ─── */}
                {(activeTab === 'users' || activeTab === 'dashboard') && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                      <div className="flex gap-2 text-sm font-bold text-gray-600">
                        {/* Status Filter */}
                        <div className="relative">
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="appearance-none flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 pr-8 rounded-xl transition-colors outline-none cursor-pointer text-sm font-bold"
                          >
                            <option value="all">Filter: All Users</option>
                            <option value="active">Active Only</option>
                            <option value="restricted">Restricted Only</option>
                            <option value="banned">Banned Only</option>
                          </select>
                          <span className="material-symbols-outlined text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            arrow_drop_down
                          </span>
                        </div>
                        
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
                          <span className="material-symbols-outlined text-[18px] text-gray-500">search</span>
                          <input 
                            type="text" 
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                      <UserTable
                         users={activeTab === 'dashboard' ? filteredUsers.slice(0, 5) : filteredUsers}
                         handleToggleBan={handleToggleBan}
                         currentUser={user}
                      />
                      {activeTab === 'dashboard' && users.length > 5 && (
                        <div className="p-4 text-center border-t border-gray-100 bg-gray-50/50">
                          <button 
                            onClick={() => setActiveTab('users')}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                          >
                            View All {users.length} Users
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB: AUDIT LOG ─── */}
                {activeTab === 'audit' && (
                  <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-8 min-h-[500px]">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">System Audit Log</h2>
                     <RecentActivityFeed full />
                  </div>
                )}

                {/* ─── TAB: SETTINGS ─── */}
                {activeTab === 'settings' && (
                  <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-8 min-h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">construction</span>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Settings</h2>
                      <p className="text-gray-500">Configuration module is currently under development.</p>
                    </div>
                  </div>
                )}

              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Components ── //

function SidebarBtn({ icon, label, badge, badgeColor, active, onClick }: any) {
  if (active) {
    return (
      <button onClick={onClick} className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl transition-all">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
        {badge && (
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all group">
      <span className="material-symbols-outlined text-[20px] group-hover:text-gray-700 transition-colors">{icon}</span>
      <span className="text-sm">{label}</span>
      {badge && (
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, iconColor, iconBg, badge, badgeColor }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
    </div>
  );
}

function HighPriorityQueue({ full = false }: { full?: boolean }) {
  const flags = [
    { id: '#PX-9204', type: 'article', title: '"This system is rigged and..."', reporter: 'JD', name: 'Jane Doe', reason: 'Hate Speech', color: 'orange', action: 'Hate Speech' },
    { id: '#PX-8112', type: 'chat', title: 'Comment: "Check out this link f..."', reporter: 'T', name: 'Mark Smith', reason: 'Spam', color: 'gray', action: 'Spam' },
    { id: '#U-5541', type: 'image', title: 'Profile Picture Update', reporter: 'AI', name: 'Auto-Guardian', reason: 'Inappropriate', color: 'gray', action: 'Inappropriate' },
  ];
  const displayFlags = full ? [...flags, ...flags] : flags;

  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Content Preview</th>
          <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Reported By</th>
          <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Reason</th>
          {full && <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {displayFlags.map((flag, i) => (
          <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
            <td className="px-4 py-5 font-bold text-sm text-gray-800">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${flag.color === 'orange' ? 'bg-orange-50 text-orange-400' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  <span className="material-symbols-outlined text-[20px]">{flag.type}</span>
                </div>
                <div>
                  <p className="truncate w-48 font-medium">{flag.title}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{flag.type === 'image' ? 'User ID:' : 'Post ID:'} {flag.id}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${flag.reporter === 'AI' ? 'bg-blue-500 text-white' : (flag.reporter === 'JD' ? 'bg-blue-100 text-blue-600' : 'bg-stone-800 text-white')}`}>
                  {flag.reporter}
                </div>
                <span className="text-xs font-bold text-gray-700 whitespace-pre-line">{flag.name.replace(' ', '\n')}</span>
              </div>
            </td>
            <td className="px-4 py-5">
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                flag.reason === 'Hate Speech' ? 'text-[#b91c1c] bg-[#fef2f2]' : 
                (flag.reason === 'Spam' ? 'text-blue-700 bg-blue-50' : 'text-orange-700 bg-orange-50')
              }`}>
                {flag.reason}
              </span>
            </td>
            {full && (
              <td className="px-4 py-5 text-right">
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-1 bg-blue-50 rounded-lg">Review</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecentActivityFeed({ full = false }: { full?: boolean }) {
  const activities = [
    { icon: 'check', color: 'green', title: 'Moderator #42 (Sarah) resolved report #PX-9102', detail: 'Reason: Not violating guidelines • 2 mins ago' },
    { icon: 'block', color: 'red', title: 'User @bad_actor_99 permanently banned', detail: 'Action by Admin Alex • 15 mins ago' },
    { icon: 'settings', color: 'blue', title: 'System filter sensitivity updated to \'High\'', detail: 'Automated system update • 1 hour ago' },
    { icon: 'delete', color: 'gray', title: 'Moderator #22 removed post PX-8812', detail: 'Reason: Copyright Infringement • 3 hours ago' },
  ];
  const list = full ? [...activities, ...activities, ...activities] : activities;

  return (
    <div className="p-2 h-full py-4">
      <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:-top-4 before:-bottom-4 before:left-2 before:w-[2px] before:bg-gray-100 overflow-hidden">
        {list.map((act, i) => (
          <div key={i} className="relative">
            <span className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center z-10 ${
              act.color === 'green' ? 'border-green-500 text-green-500' :
              act.color === 'red' ? 'border-[#d32f2f] text-[#d32f2f]' :
              act.color === 'blue' ? 'border-blue-500 text-blue-500' :
              'border-gray-400 text-gray-400'
            }`}>
              <span className="material-symbols-outlined text-[12px] font-bold">{act.icon}</span>
            </span>
            <p className="text-[13px] font-bold text-gray-900">{act.title}</p>
            <p className="text-[10px] font-medium text-gray-500 mt-0.5">{act.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserTable({ users, handleToggleBan, currentUser }: any) {
  if (users.length === 0) {
    return <div className="p-8 text-center text-gray-500 font-medium">No users found.</div>;
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User</th>
          <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
          <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Join Date</th>
          <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Flags</th>
          <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Moderation</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u: any) => (
          <tr key={u._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100" />
                <div>
                  <p className="text-sm font-bold text-gray-800">{u.name}</p>
                  <p className="text-xs font-medium text-gray-500">{u.email}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${u.isBanned ? 'bg-[#d32f2f]' : (u.flags > 1 ? 'bg-orange-500' : 'bg-green-600')}`}></div>
                <span className="text-xs font-bold text-gray-800">{u.isBanned ? 'Banned' : (u.flags > 1 ? 'Restricted' : 'Active')}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-xs font-medium text-gray-600">
              {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </td>
            <td className="px-6 py-4">
              <span className={`text-xs font-bold ${u.flags > 2 ? 'text-[#d32f2f]' : 'text-gray-800'}`}>
                {u.flags}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-3 text-xs font-bold">
                <span className={u.isBanned ? 'text-[#d32f2f]' : 'text-gray-400'}>Banned</span>
                <button 
                  onClick={() => handleToggleBan(u._id)}
                  disabled={u._id === currentUser?._id}
                  className={`w-10 h-5 rounded-full relative transition-colors ${u.isBanned ? 'bg-[#d32f2f]' : 'bg-gray-200'} ${u._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${u.isBanned ? 'right-0.5 shadow-[0_1px_3px_rgba(211,47,47,0.4)]' : 'left-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.2)]'}`}></div>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
