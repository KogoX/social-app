import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const profilePhotos = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsUiRvBjDdrSVq0W__g4vdAG0UrVygelMizOpikhkF7Btkkgg2BUdexDRV9MhtLQht6Iw6RC-aEQaBM47q4NP2LQnXabskYjC83PSZjCRRpMdkeEXLPfniyUcV0Y0Que4sShaIv_U4SSTW4OttnoxNgsBfldwfPyXsQsjYy2uEl_kIFhkRYl_2tN-uMqo6lJADb_twxkfurvRbvPzuVxOGKNqkV9-yTsvUUig8Gr2-XsbtaambeuR2JywA50UxN2BJmLgzEr2TxQc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDE2amV7iAwQDHq55FJKiOyZ7ryuZRRCHn_hifKys43AUbMUTdBU0o_kEFB9uHZRMYPN52wxsdKxR8KMnymRnDAjRDLc2G4Qv4kn2_GA0M_kyB_zQPzu9Gm6YCil-VtaeeV4fx4Q0xCrRkM1FD7lkVF2c7QfGzchdBSh9buRW6eZMQlSLyfl72d_nInt7xMo0N4CMrpO30e6UD8pb5mUFQ9IsjrHKd4mdJ9vQldGq9_GjXXjyYHgEwLQMeNxIvIiIS8Ma0mhONi9kQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_TDjyrXEIBrKb_gg1dAF2y50D-646rPiQ1XQsA6wwjXe8ZfX2AB89NlJoX_Md1bXJAzGHHHnrCfNe1pzJI2x3Wq3qIR39G9TaE3d_YJTAy1kgRVsRV_pyQheoDo-NHZhaO2sa3bONBa2qc-xCXqKCUMfjeYSjciS7AvlHRE4FYzP8_3QpgGtRtqb_ZYsagVIkq6l5SpZh1Gx-pnzzWXXoD31fGFFPhDfpr5BLizZGNlXpILC8InVrFmsv-5HuL7wu_ReOH6FNMkk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAgOU7WS0V4Xj3uKpJ3PwJyNMXwD_UWzgIUM217Tnp6v4pD1bQTZeZ9Tf5I4pFOJeWTyE4hOuNVOsEhAuHMpNobUu5m-5oWb3jRUJ0_6y6_ustAvGSaNMl1mKaFHN1HYMW2rbMu-WYWloWrMQnkEV9o4cq6Bq7DTHhu5o8GEj_c3a-E-mS7TQp7h6eC0uyaJou3kVdLLBJPdrBEAs3ieTpydfsXecpIzzhm-OSHADehgIPvUXdY4sB3SA_-d4OLhtt-909h6I9lMJA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1zGLciIwh4kv9QGZ_QM-57ZLALXCM2mtVUp6uWLMGoXeSBC30gvuo3AfS7Mx9gZgk7u1pyMdxo4wRoVuie4K-CW5m_cSC0nHaJB7GqnUGkf-1oBrPRfSfbXLfYXY-WV8577iO0gKaL-3vv0ePZtfmCcmwUpMD7XyfiD44bHW6HcMNoqT-ZsKNV2CZrHBQ6SRqhWKN83sP9-Ky0kpiHhOsGADAJhhjo_qInbHaiPRpQtfJg40vJu_EOBew4_y88EmvGHv4Em2XPg0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSzVFNl65Kz4bLcLKTnLdBwnqFtncHSRf-DOMlWqXC4DAQUU4VXEtPyaT-LocZOlkGcPCh-mmRJLtCmx3LBufM3DHPOOG4ka1WC61d-ocSiR3K_QupbDoh1gOmd49wbgT708AHgsWsXbD8yr7dq6gJJ3Lw65r0ZFgzlrmJvwwnFpW8bt8hh-S3LHnFB_-KCPVPGCqrZVSMvScyBK6FjS6r34BFiQolNM59UjH42X5rnOMaT3TEIc8RlZI44S6yZ5r_n73DhOzg584',
];

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos' | 'archives'>('posts');

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState((user as any)?.bio || '');

  const handleUpdateBio = async () => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', { bio: bioInput });
      const rawLocal = localStorage.getItem('userInfo');
      if (rawLocal) {
        const localUser = JSON.parse(rawLocal);
        localStorage.setItem('userInfo', JSON.stringify({ ...localUser, bio: data.bio }));
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to update bio', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      api.get(`/posts/user/${user._id}`)
        .then(({ data }) => setPosts(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-container-low pb-20">
      {/* Cover + Profile Header */}
      <div className="relative bg-surface-container-lowest">
        <div className="h-64 md:h-80 w-full relative overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv_V-LOBLuFBi3OICVE6vEuy5SBYXXc6lcukOUazA5fSbs1uZ9HilXbr96Q1gj8lIzBtTLtA4EHo4EQN2DXu4gUJ6DxNXvid721zWitmlj-X2_8q-p4NoSSK3i28KUaEd6chPBbc8halzMGWSzoIyeTExMsdbtfybid_ipW6Cmwzvub0ijBt2ttJBpjpLLZvCfrp4MN6WbFBEaVnmWQCGZc2hv7mXnwi-vRQCP2pLWPosjnZGpp2A8MqkNTwTBHYrZ2VwPTwx3RuE"
            alt="Cover photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <button className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            Edit Cover
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-end md:items-center -mt-16 md:-mt-20 gap-6 pb-6 border-b border-outline-variant/10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface-container-lowest shadow-xl overflow-hidden relative group shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover bg-surface-variant" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left mt-16 md:mt-0">
              <h1 className="text-3xl font-bold text-on-surface tracking-tight">{user.name}</h1>
              <p className="text-on-surface-variant font-medium mt-1">{(user as any).title || 'Digital Curator'}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-outline font-medium">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span>{(user as any).location || 'Location Not Set'}</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">work</span>{(user as any).work || 'Work Not Set'}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0 shrink-0">
              <button className="px-6 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md shadow-primary/20 text-sm">
                <span className="material-symbols-outlined text-[20px]">edit</span> Edit Profile
              </button>
              <button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-semibold hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar">
            {(['posts', 'about', 'friends', 'photos', 'archives'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold text-sm whitespace-nowrap capitalize transition-colors ${activeTab === tab ? 'text-primary border-b-[3px] border-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Sticky Sidebar info) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Intro Box */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <h2 className="text-lg font-bold text-on-surface mb-4">Intro</h2>
            
            {isEditingBio ? (
              <div className="mb-4">
                <textarea 
                  value={bioInput} 
                  onChange={e => setBioInput(e.target.value)} 
                  className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none h-24 resize-none text-on-surface"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-2 mt-3">
                  <button onClick={handleUpdateBio} className="flex-1 py-1.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90">Save</button>
                  <button onClick={() => setIsEditingBio(false)} className="flex-1 py-1.5 bg-surface-container-high text-on-surface text-sm font-bold rounded-xl hover:bg-surface-variant">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-5">{(user as any).bio || 'No bio yet. Add one to tell people about yourself.'}</p>
            )}

            <div className="flex flex-col gap-3.5 text-sm font-medium">
              <div className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">school</span>
                <span>Studied at <span className="font-bold text-on-surface">{(user as any).school || 'Not specified'}</span></span>
              </div>
              <div className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">home</span>
                <span>Lives in <span className="font-bold text-on-surface">{(user as any).location || 'Not specified'}</span></span>
              </div>
              <div className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">rss_feed</span>
                <span>Followed by <span className="font-bold text-on-surface">{(user as any).followers?.toLocaleString() || 0} people</span></span>
              </div>
              <div className="flex items-start gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">calendar_month</span>
                <span>Joined <span className="font-bold text-on-surface">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></span>
              </div>
            </div>
            
            {!isEditingBio && (
              <button 
                onClick={() => {
                  setBioInput((user as any).bio || '');
                  setIsEditingBio(true);
                }} 
                className="w-full mt-6 py-2.5 bg-surface-container-low hover:bg-surface-container font-bold text-sm text-on-surface transition-colors rounded-xl"
              >
                Edit Details
              </button>
            )}
          </div>

          {/* Photos Box */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-on-surface">Photos</h2>
              <button onClick={() => setActiveTab('photos')} className="text-primary text-sm font-bold hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
              {profilePhotos.map((url, i) => (
                <img key={i} src={url} alt="Gallery item" className="aspect-square w-full object-cover hover:opacity-90 cursor-pointer transition-opacity" />
              ))}
            </div>
          </div>
          
          {/* Friends Box */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-bold text-on-surface">Friends</h2>
              <button onClick={() => setActiveTab('friends')} className="text-primary text-sm font-bold hover:underline">See All</button>
            </div>
            <p className="text-xs text-on-surface-variant font-medium mb-4">{user.friends?.length || 0} friends</p>
            <div className="grid grid-cols-3 gap-3">
               {/* Mock friends since we don't have full profiles loaded here natively without another fetch */}
               {profilePhotos.slice(0, 6).map((url, i) => (
                 <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                   <img src={url} alt="Friend rounded-xl" className="aspect-square w-full object-cover rounded-xl group-hover:opacity-90 transition-opacity drop-shadow-sm" />
                   <span className="text-xs font-bold text-on-surface truncate">User {i+1}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column (Dynamic Tab Content) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeTab === 'posts' && (
            <>
              {/* Composer */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="flex gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant/10" />
                  <button className="flex-1 bg-surface-container-low hover:bg-surface-container transition-colors text-left px-5 rounded-full text-on-surface-variant text-sm font-medium">
                    What's on your mind?
                  </button>
                </div>
                <div className="flex mt-3 pt-3 border-t border-outline-variant/10 -mx-1">
                  <button className="flex-1 flex items-center justify-center gap-2 text-on-surface-variant font-bold text-sm hover:bg-surface-container-low py-2.5 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-red-500">videocam</span> Live video
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 text-on-surface-variant font-bold text-sm hover:bg-surface-container-low py-2.5 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-green-500">photo_library</span> Photo/video
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 text-on-surface-variant font-bold text-sm hover:bg-surface-container-low py-2.5 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-amber-500">flag</span> Life event
                  </button>
                </div>
              </div>

              {/* Dynamically Loaded Posts */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-on-surface-variant font-medium text-sm">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 text-center rounded-2xl shadow-sm border border-outline-variant/10">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3 block">feed</span>
                  <h3 className="text-lg font-bold text-on-surface mb-1">No posts available</h3>
                  <p className="text-on-surface-variant text-sm">When you share posts, they will appear here.</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post._id} className="relative">
                     <PostCard 
                       post={{
                         ...post,
                         id: post._id,
                         timestamp: new Date(post.createdAt).getTime(),
                         likes: post.likes?.length || 0,
                         comments: post.comments || []
                       }} 
                     />
                  </div>
                ))
              )}
            </>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === 'about' && (
            <div className="bg-surface-container-lowest p-8 text-center rounded-2xl shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">info</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">About {user.name}</h3>
              <p className="text-on-surface-variant text-sm">Detailed personal information and history goes here.</p>
            </div>
          )}
          
          {activeTab === 'friends' && (
            <div className="bg-surface-container-lowest p-8 text-center rounded-2xl shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">group</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">Friends List</h3>
              <p className="text-on-surface-variant text-sm">Full searchable directory of connections.</p>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="bg-surface-container-lowest p-8 text-center rounded-2xl shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">photo_library</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">Photo Gallery</h3>
              <p className="text-on-surface-variant text-sm">All uploaded photos and albums.</p>
            </div>
          )}

          {activeTab === 'archives' && (
            <div className="bg-surface-container-lowest p-8 text-center rounded-2xl shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">inventory_2</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">Content Archive</h3>
              <p className="text-on-surface-variant text-sm">Old and hidden posts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
