import type { User, Post, Story, FriendRequest, Conversation, Message, Notification } from '../types';

// ============================================
// Mock Data – Matches HTML mockup content
// ============================================

export const currentUser: User = {
  id: 'alex-rivera',
  name: 'Alex Rivera',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw_8YzpQdaC7LK3Pb9BK16eg2zaYnF5UcUe72PIs2eViXaWKdo2bUPO8Uz_B5pVMdr7X0bq-oaQjR-Lrq2jv5CPk9hxj0zTkeE3PpcRm3YfGcE5qBlNJYjQsNDZoSP6bHoVjAsDxmVDTvaN2x3t9fTX5-zv6X8NaE7hSP2xBUDugS0PwJpycFfnzyMTjXg9npsvi48qTbuAuZDOndaWZ8KlMKpTR0WOz_cwXQhCnhmIm_vqIwmpGZeqVb2oEbj66qnE837WM9JhiM',
  bio: 'Exploring the intersection of minimalism and digital culture. Passionate about brutalist architecture and clean code.',
  title: 'Digital Strategist & Art Collector',
  location: 'San Francisco, CA',
  work: 'Lead Creative @ StudioX',
  school: 'RISD',
  followers: 1284,
  isOnline: true,
};

export const mockUsers: User[] = [
  { id: 'sarah-jenkins', name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtYlYtAaEvmxnu207t-lYaT3YaNvi65DLF9pG1EaIG6WJNUme5fsHIljIV7A1BoQkfHxGzQKpSVkKVjdi8lKEAnsdpPUTK3l4zfy6MM-eqHQNXFNl1U1U9_SF7tP523vtRAU91NoUazPmO5e77mzgPqYK_fw1uTU-G-F5Ca_yCvTUP7dVJRMa3QA-YvilyHsoTtx90uf452XvHaIBT4mFKforNvKvVaYP0xxSzYHzvPddEXrS4EzrqKaxLMVQQfoE6aRHah9y_MnU', isOnline: true },
  { id: 'marcus-chen', name: 'Marcus Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO1zIlHoSQT-gJ-jvSBCG5z4GhOpiCl7W5EgrJVxmEunv85-SHZs6Zn-UyY7-WcLTIZRrlYvjI2bWBOF3W2FzJyNuTY0CYD84GqKrJwTpmYxDspJJ39pmWYx3cMlpYXBaZ1nLFx_FyYlejbNYuzbmSjVms_huhae3zEb0D8k7GNo3yVPEpnO04ppBEJ04w8HBQCC--BdXQjGn-en4DL861JUeZyjyd5-EuRJwYPm-2XsCda2aSsY4cyW3T84dkrYNiRwa-3gCKKSk', isOnline: false },
  { id: 'david-park', name: 'David Park', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvRbice4iOUhDCewwpPzJOw1KzPY0fF_5gSymip5HnRKTQTd4ZM0vziUEcIqfmovqT8mAUYJfUxbuOgjaYZKdw6pa6ZruBFO6PEnFKev8nnPXCqcwxegSBNrTg7LsFt92OCa_JZNMg9lYn2EqdFw9tkCJE9haO3tHJpiKkvcMGG-BxyGauu-IuybJrn_0uQihZEDX_-etvDZs3TFXGvcCjqk_aKuVB0b7AsYp5qOPe5xqMeAUz8VhwZvgqO70eDJXZre9tvuWVug', isOnline: true },
  { id: 'chloe-kim', name: 'Chloe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBtPyjcQcXRr13SY0BSSi5Gaq06tR88kwKEOfo0OAsjxJmRtNSEU5AgPBtn7BxVA_Z8cbv4feIOVzw60HpiaZ_q4b_n_vHQgAX-1JTgO2RWFuFKoeioNCIzXzNumUCEqD6MtLcoje5dKApjOQMZGXdZllks_zsGms9X8kD_faR-052hlN9BQ5N8JZ-mZkzX1v5WaRyjTuuHWg6WvS187XqUSVNCAH8Ta7F_Z_6bqF3gy4RlmZRPf3-9dt4ko8ABBIdCJtPKasmoo', isOnline: false },
  { id: 'leo-richards', name: 'Leo Richards', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddyGa6zuCD-bKz6cem6rEBz0Q5tAToWhEpbawsZlzFzy0Zpd4S4ZhpcOs1G5GrRzj0AGJRwHPWf56sP0x4GsDm89zO0ke7BgipeVOVvX_UJQl9-Av5EEtAu3QdV2TNXjvSau-W7UkCaTUX9fbeOyzxL7BRxpri_vg5yXEsb8I3HV-i2h-_lrVM6tJULJ_nsgxMIDWUDFAtpU-Sw2Rp_XFOVlkl0YK85VCNzdfqrF6lEw_Vzgzb9WOXAr6WT6bwXsYkOdwWPIyW44', isOnline: true },
  { id: 'emily-blunt', name: 'Emily Blunt', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2mC--lTZvOcwaTrtXEi-SsYUCnRhG8v8aYbbDdwGioVa43WAekaIKXqhTreHJHbQhwiTF7KUvHXqzcj__tSIVK2rn_OXA3ibsG5DM3061bfnt3FM4NCXyzboFP4u5D-Rfm83rG7Ni-D9BgOtJLre4-7wgk7M7mIbYA8PMzZ6MpgDHaEdyjhWf5wi_mbcjH8eTZQlolcR-30bj1aEztsSXTZ0nmwpYvggPoF-82Jw9CDwGrEByGFvuFCf2fGf__AruCmU5dSNAWTA', isOnline: false },
  { id: 'jordan-smith', name: 'Jordan Smith', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAoO3s41Ew915iLqHx7jQIOWXdXmIiDT0FVNynR-AfXPQQPCRl6UvmLmEa2K63-AZwrmvTxo46oPDdFbFMRJidObahsjco_I_W0ddRZWPwU49PCveuOVFymj5cyQb4a2M8EWjmk9oIW2E7A65zJhxabDfyKKkOUGjcKBqQED4JvC2sXfTQs-Dqd56GPMhUdfvWsn-DtmKBDylXVg4HkRA-68LKJf10duN7vNlPAlBVulQM2yT_uirblkRpfmW8D9POxqXqgUT_MfM', isOnline: true },
  { id: 'adrian-voce', name: 'Adrian Voce', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxuWcWmIM8VdoH7ZGOcme_42rhxWBRPt9dTxryvSGuJCkjokAUny0LhupoaOfafFYLfO7qWkcqnw8DBWHyjzRMxFL_RSG4lTOM79UwjTWj1GSpSxMWHU3xl749BTtsRDhx04HcHBK6yRSW1Rt9t7XQejYbuvGfpXTKHebNHUfY-LucFbHf9e_ePy2kOJd2iaSX2oyHLFy904jKF-nM7DuT4VA7wOsZI6Vsyx1qMgQXaU7BccjcKJVRcX4ulmjw6F2jjCdtSsTWcU', isOnline: false },
  { id: 'julian-alvarez', name: 'Julian Alvarez', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCelbRYfUWMm5jZhgUjpcYtTJK2ajzed71oQ8gh--87_O64PI8VMq23AmymU4fjcMIqnMZ963thvkmCEMOgNzOGew4jgAxKIpfGRKuB73-HJw9KQEdi1svaQKAT68V3HTzozY596rm7DRoAjJwHrOptus4tCeutQvkt81cl3CF9VkQeoykZzsw2cGN0cHfgnsHe-utHBgVbCPl2yoAjiAihSEFLwNizrLRQ4rvf8EcSUih73S91WNRm6bUV-nfxNfytLXmjvWuKC-I', isOnline: false },
  { id: 'juliana-smith', name: 'Juliana Smith', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZNZkJCmIF8cfg6-VFyFvdvaHztW18VxY7Jv8iyFBOOt052KCYLbvK5_rbeSYvSWQr2FQ6vWTqnaUwfh_Okb379nxd-uFi8EzQr7dRgOHrMvQngUBywT-xYcElABrppDcMn9D1UHL5J0h8VcTquoxI21lsttngvNHzoo1APrXrBiKSuRVu5gtAs7oWUv59i-wwimWxE3SDJ5yqew5thopFDXoTIJy-fSW3DLVqhasJBvc_-q0Qn7GXYMEncOX-NJtXhTQ-xzX1vo', isOnline: false },
];

export const mockStories: Story[] = [
  { id: '1', user: mockUsers[0], hasNew: true },
  { id: '2', user: mockUsers[1], hasNew: true },
  { id: '3', user: mockUsers[2], hasNew: true },
  { id: '4', user: mockUsers[3], hasNew: true },
  { id: '5', user: mockUsers[4], hasNew: true },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: mockUsers[0],
    content: 'Just finished the morning hike at Mirror Lake. The reflections today were absolutely breathtaking! Nature really is the best therapy. 🌲✨',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNz_aUryrqZGii-XCKwqRaria96zbcKr_KOpajQ0cxf4dY2z3HEViVHRNYAUx2C97-SD25N8f5YaP3-1Z7f5OFBbLuej9yj11h3duXCIse5Pd3ZqTzdyE4-IQFmafSeZV_Gv5gmU2UaJ1OtkW3k_FOtVwX4wX5QcYsvB3GMfw9BRHbJPBayy-ah682V246PY-CsWKU5utQmfKDwTx2KfVUuklXDbKxYPqgcGQ-tcovb08bvS-jNeRejmqxvueZQO_uqIb-ytaCogQ',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 124,
    comments: 12,
    shares: 5,
    visibility: 'public',
  },
  {
    id: 'post-2',
    author: mockUsers[4],
    content: 'Anyone here familiar with the new "Digital Curator" design system? Looking for some feedback on a project I\'m starting. Feel free to DM! 🎨💻',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 42,
    comments: 3,
    shares: 0,
    visibility: 'friends',
  },
];

export const mockFriendRequests: FriendRequest[] = [
  { id: 'fr-1', user: { id: 'sarah-chen', name: 'Sarah Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9JMTBPOvKEBMVM7_kj5WvJCqEb3U4pmoZKF5oX6zCL09PBkrMtdXzhuEhUMm5fXM-stOC9T6gYUqEaRLPeVzqPFT8IadMlGY-aQkLoUjL4oGQd2KUdld03xqByI_ivOPh5xQRwfn0Ywg5Hj1mK2zn1uxBEk_-4Y1eiYOkI4ev0vgqnKXnrEwdv8kH43G4b9xeuVqD2Us9za5E7VcJh7ohD64BklZ1OXae-BYvcqHiNyPdeKC44tW6FMP7g8KQP3B2Dlg46IPp4kU' }, mutualFriends: 12, coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9JMTBPOvKEBMVM7_kj5WvJCqEb3U4pmoZKF5oX6zCL09PBkrMtdXzhuEhUMm5fXM-stOC9T6gYUqEaRLPeVzqPFT8IadMlGY-aQkLoUjL4oGQd2KUdld03xqByI_ivOPh5xQRwfn0Ywg5Hj1mK2zn1uxBEk_-4Y1eiYOkI4ev0vgqnKXnrEwdv8kH43G4b9xeuVqD2Us9za5E7VcJh7ohD64BklZ1OXae-BYvcqHiNyPdeKC44tW6FMP7g8KQP3B2Dlg46IPp4kU' },
  { id: 'fr-2', user: { id: 'marcus-wright', name: 'Marcus Wright', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSyD4_gEHLd8D3tg0ur-Wux-iRf66pLOaWltbLpBhtH3yhYWgeemQP-7mMrHYzReXweAlNz9yX86C6_LW9-9HYpX258URrPyyMeEyd7WjyYVfdo3Yq-G0ZmQdIzrf2KxgwRuoAL4C1MR8AaCYE6IIM79-Zk7tWsCEBypFJ8RofjedVArXqKBv0a_m1QNLCAfbKsBc3wXTJ1TifGFnozigDUBg1kEOT6QO8BexVYz6QZgnwzPy1dLNLS3hxh4S07QgKPFK3Ezi6LXI' }, mutualFriends: 5, coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSyD4_gEHLd8D3tg0ur-Wux-iRf66pLOaWltbLpBhtH3yhYWgeemQP-7mMrHYzReXweAlNz9yX86C6_LW9-9HYpX258URrPyyMeEyd7WjyYVfdo3Yq-G0ZmQdIzrf2KxgwRuoAL4C1MR8AaCYE6IIM79-Zk7tWsCEBypFJ8RofjedVArXqKBv0a_m1QNLCAfbKsBc3wXTJ1TifGFnozigDUBg1kEOT6QO8BexVYz6QZgnwzPy1dLNLS3hxh4S07QgKPFK3Ezi6LXI' },
  { id: 'fr-3', user: { id: 'elena-rodriguez', name: 'Elena Rodriguez', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfP9NPSiRO2EYcvC4Tgbp1mFQTLCzR_FfOGWTH_ZpEAigx0w7N422ZlcG10_n9j-hYCI7r9dQXMxW_DzzAV4_PiU_9ZFY-R_aDOEpWxRbQigQfUGMrPRjyYwNH0ZDiOxLKzroI2o8qylJM4BXOj_TjTQuXyCmZVi0YldxIpGEi-5l3wbwJhZaBLuKVbCH5RuS4ZWSLR6FDDvgOYQioSZT7MUshzLvRLDSi99dtcpuEQTANR_eGO_SzMyIC4PlBRfymip2Dion9s5I' }, mutualFriends: 8, coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfP9NPSiRO2EYcvC4Tgbp1mFQTLCzR_FfOGWTH_ZpEAigx0w7N422ZlcG10_n9j-hYCI7r9dQXMxW_DzzAV4_PiU_9ZFY-R_aDOEpWxRbQigQfUGMrPRjyYwNH0ZDiOxLKzroI2o8qylJM4BXOj_TjTQuXyCmZVi0YldxIpGEi-5l3wbwJhZaBLuKVbCH5RuS4ZWSLR6FDDvgOYQioSZT7MUshzLvRLDSi99dtcpuEQTANR_eGO_SzMyIC4PlBRfymip2Dion9s5I' },
];

export const mockConversations: Conversation[] = [
  { id: 'conv-1', user: mockUsers[0], lastMessage: "That sounds like a great idea! Let's...", lastMessageTime: '2m', unread: true },
  { id: 'conv-2', user: mockUsers[1], lastMessage: "I'll send over the files tonight.", lastMessageTime: '1h' },
  { id: 'conv-3', user: { id: 'elena-r', name: 'Elena Rodriguez', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw_LL65ZUfenFzjVutgJVJVFKD9tEf7EykMGzFbA2PjxMVjOsJnpwBvosKJtx8hStC6Okdm2Mnb48PYyBozeqvd1Mnxd5aAdYjvKm-yKYdVUHyo_MCUzcr8xDcikyo65TAN4rlfsIwVR4pDcqZg24aCG_uLzXwD1XapDDN0Soh3QenNJuPWc_pgBLzQFLOvJoYko9DM5LBopYQ8koMqwtTZxBa_ihY5xs0hZcVOddbM-E0JFK4nJJi-uKAWzzfxp9MXorNtKQGHVg' }, lastMessage: 'You: See you there at 7!', lastMessageTime: '4h', isOwnMessage: true },
  { id: 'conv-4', user: mockUsers[2], lastMessage: 'Thanks for the recommendation.', lastMessageTime: 'Yesterday' },
];

export const mockMessages: Message[] = [
  { id: 'msg-1', senderId: 'sarah-jenkins', content: 'Hey Alex! I saw your recent post about the photography exhibition. Are you planning on going this weekend?', timestamp: Date.now() - 20 * 60 * 1000, isOwn: false },
  { id: 'msg-2', senderId: 'alex-rivera', content: 'Hi Sarah! Yes, I was thinking about heading there on Saturday afternoon. It looks incredible.', timestamp: Date.now() - 18 * 60 * 1000, isOwn: true, status: 'read' },
  { id: 'msg-3', senderId: 'alex-rivera', content: "Have you seen any of the curator's previous work?", timestamp: Date.now() - 17 * 60 * 1000, isOwn: true, status: 'read' },
  { id: 'msg-4', senderId: 'sarah-jenkins', content: "Not in person, but I've followed them on social media for a while. Their use of natural light is just stunning.", timestamp: Date.now() - 14 * 60 * 1000, isOwn: false },
  { id: 'msg-5', senderId: 'sarah-jenkins', content: "That sounds like a great idea! Let's meet at the entrance around 2pm if that works for you?", timestamp: Date.now() - 13 * 60 * 1000, isOwn: false },
];

export const mockNotifications: Notification[] = [
  { id: 'n-1', user: mockUsers[0], type: 'like', content: 'liked your recent photo from <span class="font-semibold text-primary">Lake Tahoe trip</span>.', timestamp: Date.now() - 2 * 60 * 60 * 1000, isRead: false, actionIcon: 'favorite', actionColor: 'bg-primary' },
  { id: 'n-2', user: mockUsers[2], type: 'mention', content: 'mentioned you in a comment.', quote: 'Totally agree with @AlexRivera on this one! The resolution is incredible.', timestamp: Date.now() - 5 * 60 * 60 * 1000, isRead: false, actionIcon: 'alternate_email', actionColor: 'bg-tertiary' },
  { id: 'n-3', user: mockUsers[4], type: 'comment', content: 'commented on your post about <span class="font-semibold text-primary">workspace minimalism</span>.', timestamp: Date.now() - 26 * 60 * 60 * 1000, isRead: true, actionIcon: 'chat_bubble', actionColor: 'bg-secondary' },
  { id: 'n-4', user: mockUsers[1], type: 'friend_request', content: 'sent you a friend request.', timestamp: Date.now() - 48 * 60 * 60 * 1000, isRead: true, actionIcon: 'person_add', actionColor: 'bg-primary' },
  { id: 'n-5', user: mockUsers[5], type: 'share', content: 'shared your post in <span class="font-semibold text-primary">Design Community</span> group.', timestamp: Date.now() - 72 * 60 * 60 * 1000, isRead: true, actionIcon: 'share', actionColor: 'bg-tertiary' },
  { id: 'n-6', user: mockUsers[3], type: 'like', content: 'and <span class="font-semibold">4 others</span> liked your comment.', timestamp: Date.now() - 96 * 60 * 60 * 1000, isRead: true, actionIcon: 'thumb_up', actionColor: 'bg-primary' },
];
