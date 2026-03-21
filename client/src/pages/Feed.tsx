import { useState, useEffect, useMemo } from 'react';
import PostCard from '../components/PostCard';
import { mockUsers, mockStories } from '../data/mockData';
import { rankPosts } from '../utils/sorting';
import { SocialGraph } from '../utils/graph';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts/feed');
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const { data } = await api.post('/posts', { content: newPostContent, visibility: 'public' });
      setPosts([data, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  // Convert backend createdAt to timestamp for rankPosts
  const formattedPosts = useMemo(() => {
    return posts.map(p => ({
      ...p,
      id: p._id,
      timestamp: new Date(p.createdAt).getTime(),
      likes: p.likes?.length || 0,
      comments: p.comments?.length || 0
    }));
  }, [posts]);

  // ===== DSA: Merge Sort for Feed Ranking =====
  // Posts are ranked using merge sort with a composite score (recency + engagement)
  const rankedPosts = useMemo(() => rankPosts(formattedPosts), [formattedPosts]);

  // ===== DSA: Graph + BFS for Friend Suggestions =====
  // Build social graph and use BFS to find friends-of-friends
  const suggestions = useMemo(() => {
    if (!user) return [];
    const graph = new SocialGraph();
    // Add current user and their friends
    graph.addFriendship(user._id, 'sarah-jenkins');
    graph.addFriendship(user._id, 'marcus-chen');
    graph.addFriendship(user._id, 'david-park');
    graph.addFriendship(user._id, 'leo-richards');
    // Add friend-of-friend connections
    graph.addFriendship('sarah-jenkins', 'emily-blunt');
    graph.addFriendship('sarah-jenkins', 'jordan-smith');
    graph.addFriendship('marcus-chen', 'emily-blunt');
    graph.addFriendship('marcus-chen', 'adrian-voce');
    graph.addFriendship('david-park', 'jordan-smith');
    graph.addFriendship('david-park', 'adrian-voce');

    // BFS finds users at distance 2 with mutual friend counts
    return graph.getSuggestions(user._id, 3);
  }, [user]);

  const suggestionUsers = mockUsers.filter(u => suggestions.some(s => s.userId === u.id));

  if (!user) return null;

  return (
    <div className="px-4 md:px-8 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-8">
      {/* Main Feed */}
      <section className="max-w-[680px] mx-auto w-full space-y-8 pb-20">
        {/* Story Bar */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-outline-variant p-0.5 group-hover:border-primary transition-colors">
              <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-on-surface-variant">Your Story</span>
          </div>
          {mockStories.map(story => (
            <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative w-16 h-16 rounded-full p-[2px] ring-2 ring-primary ring-offset-2 ring-offset-surface">
                <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-[10px] font-semibold text-on-surface">{story.user.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {/* Create Post */}
        <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10">
          <div className="flex gap-4">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-surface-container-high/50 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-outline h-24 resize-none"
                placeholder={`Share what's on your mind, ${user.name.split(' ')[0]}...`}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-blue-500 text-[20px]">image</span>
                <span className="text-xs font-semibold">Photo</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-green-500 text-[20px]">videocam</span>
                <span className="text-xs font-semibold">Video</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined text-orange-500 text-[20px]">mood</span>
                <span className="text-xs font-semibold">Feeling</span>
              </button>
            </div>
            <button onClick={handleCreatePost} className="bg-primary text-white px-6 py-1.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors">
              Post
            </button>
          </div>
        </div>

        {/* Feed Posts (ranked by merge sort) */}
        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Loading posts...</div>
        ) : (
          rankedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </section>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex flex-col gap-6 sticky top-20 h-fit">
        {/* Birthdays */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-tertiary">featured_seasonal_and_gifts</span>
            <h4 className="text-sm font-bold text-on-surface">Birthdays</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface">Marcus Chen</span> and <span className="font-bold text-on-surface">2 others</span> have birthdays today.
          </p>
        </div>

        {/* Friend Suggestions (BFS-powered) */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-on-surface">Suggestions</h4>
            <button className="text-xs font-semibold text-primary hover:underline">See all</button>
          </div>
          <div className="space-y-5">
            {suggestionUsers.map((user, i) => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-on-surface">{user.name}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {suggestions[i]?.mutualCount || 0} mutual friends
                    </p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Online Friends */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
          <h4 className="text-sm font-bold text-on-surface mb-6">Online</h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockUsers.filter(u => u.isOnline).slice(0, 4).map(user => (
              <div key={user.id} className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
