// ============================================
// Type Definitions for Curator App
// ============================================

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  title?: string;
  location?: string;
  work?: string;
  school?: string;
  followers?: number;
  isOnline?: boolean;
  lastActive?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'friends' | 'private';
}

export interface Story {
  id: string;
  user: User;
  hasNew: boolean;
}

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  coverImage: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  isOwnMessage?: boolean;
  unread?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Notification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'mention' | 'friend_request' | 'share' | 'birthday';
  content: string;
  quote?: string;
  timestamp: number;
  isRead: boolean;
  actionIcon: string;
  actionColor: string;
}

export interface SearchResult {
  id: string;
  user: User;
  mutualFriends: number;
  mutualAvatars: string[];
  subtitle: string;
}
