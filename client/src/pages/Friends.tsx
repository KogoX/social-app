import { useState, useEffect } from 'react';
import FriendCard from '../components/FriendCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Friends() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Friend Requests');
  const tabs = ['Friend Requests', 'Suggestions', 'All Friends'];
  const [allFriends, setAllFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchFriendsData = async () => {
      try {
        const [profileRes, usersRes] = await Promise.all([
          api.get(`/users/${user._id}`),
          api.get('/users') // returns up to 10 other users
        ]);

        const myFriends = profileRes.data.friends || [];
        setAllFriends(myFriends);

        const myFriendIds = new Set(myFriends.map((f: any) => f._id));

        // Users we don't already follow
        const nonFriends = usersRes.data.filter((u: any) => !myFriendIds.has(u._id) && u._id !== user._id);
        
        // Split non-friends: half for requests, half for suggestions (for UI demonstration)
        const midpoint = Math.ceil(nonFriends.length / 2);

        setFriendRequests(nonFriends.slice(0, midpoint).map((u: any) => ({
          id: u._id,
          user: u,
          mutualFriends: Math.floor(Math.random() * 5), // placeholder for mutuals
          coverImage: u.avatar
        })));

        setFriendSuggestions(nonFriends.slice(midpoint).map((u: any) => ({
          userId: u._id,
          mutualCount: Math.floor(Math.random() * 5),
          user: u
        })));

      } catch (error) {
        console.error('Failed to fetch friends data', error);
      }
    };

    fetchFriendsData();
  }, [user]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await api.put(`/users/${friendId}/unfollow`);
      setAllFriends(prev => prev.filter(f => f._id !== friendId));
    } catch (error) {
      console.error('Failed to remove friend', error);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-6">Friends</h1>
          <div className="flex gap-8 border-b border-surface-container-highest/30">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-medium transition-all relative ${
                  activeTab === tab ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        {/* Friend Requests */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-on-surface">
              Friend Requests <span className="text-sm font-normal text-on-surface-variant ml-2">({friendRequests.length})</span>
            </h2>
            <a href="#" className="text-primary text-sm font-semibold hover:underline">See all</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friendRequests.map(req => (
              <FriendCard key={req.id} request={req} variant="request" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-on-surface mb-6">People You May Know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friendSuggestions.map(suggestion => (
              <FriendCard
                key={suggestion.userId}
                request={{
                  id: suggestion.userId,
                  user: suggestion.user,
                  mutualFriends: suggestion.mutualCount,
                  coverImage: suggestion.user.avatar,
                }}
                variant="suggestion"
              />
            ))}
          </div>
        </section>

        {/* All Friends */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-on-surface">
              All Friends <span className="text-sm font-normal text-on-surface-variant ml-2">1,248 friends</span>
            </h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
              <input type="text" placeholder="Search friends" className="pl-9 pr-4 py-1.5 text-sm bg-surface-container-lowest border-none rounded-full focus:ring-1 focus:ring-primary w-48 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFriends.map(friend => (
              <div key={friend._id} className="bg-surface-container-lowest rounded-lg p-3 flex justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full object-cover" />
                    {friend.isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-tertiary border-2 border-white"></div>}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-on-surface">{friend.name}</h4>
                    <p className="text-xs text-on-surface-variant">{friend.isOnline ? 'Active now' : 'Active recently'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveFriend(friend._id)} 
                  className="p-2 hover:bg-slate-50 rounded-full text-outline-variant hover:text-error transition-colors"
                  title="Remove Friend"
                >
                  <span className="material-symbols-outlined text-xl">person_remove</span>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="px-6 py-2 bg-surface-container-highest text-on-surface rounded-full font-semibold text-sm hover:bg-surface-variant transition-colors active:scale-95">
              Load More Friends
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
