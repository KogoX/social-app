import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ConvUser {
  _id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface Conversation {
  id: string;
  user: ConvUser;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isOwn: boolean;
  status: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New conversation search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConvUser[]>([]);
  const [searching, setSearching] = useState(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations/all');
        const formatted: Conversation[] = data.map((conv: any) => ({
          id: conv.participant._id,
          user: {
            _id: conv.participant._id,
            avatar: conv.participant.avatar,
            name: conv.participant.name,
            isOnline: conv.participant.isOnline,
          },
          lastMessage: conv.content,
          lastMessageTime: new Date(conv.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          unread: conv.status === 'sent' && conv.receiver === user._id,
        }));
        setConversations(formatted);
        if (formatted.length > 0 && !activeConvId) {
          setActiveConvId(formatted[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConvId || !user) return;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${activeConvId}`);
        const formatted: Message[] = data.map((msg: any) => ({
          id: msg._id,
          senderId: msg.sender._id,
          content: msg.content,
          timestamp: new Date(msg.createdAt).getTime(),
          isOwn: msg.sender._id === user._id,
          status: msg.status,
        }));
        setMessages(formatted);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchMessages();
  }, [activeConvId, user]);

  // Search users for new conversation
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/users?search=${encodeURIComponent(searchQuery)}`);
        setSearchResults(
          data.map((u: any) => ({
            _id: u._id,
            name: u.name,
            avatar: u.avatar,
            isOnline: u.isOnline,
          }))
        );
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectConversation = useCallback((convId: string) => {
    setActiveConvId(convId);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const startConversationWith = useCallback(
    (targetUser: ConvUser) => {
      // Check if conversation already exists
      const existing = conversations.find((c) => c.id === targetUser._id);
      if (!existing) {
        // Create a placeholder conversation
        setConversations((prev) => [
          {
            id: targetUser._id,
            user: targetUser,
            lastMessage: 'Start a conversation...',
            lastMessageTime: 'Now',
            unread: false,
          },
          ...prev,
        ]);
      }
      setActiveConvId(targetUser._id);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    },
    [conversations]
  );

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConvId || !user) return;

    const tempId = `msg-${Date.now()}`;
    const msg: Message = {
      id: tempId,
      senderId: user._id,
      content: newMessage,
      timestamp: Date.now(),
      isOwn: true,
      status: 'sent',
    };

    // Optimistic UI
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');

    // Update conversation list preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: msg.content, lastMessageTime: 'Now' }
          : c
      )
    );

    try {
      const { data } = await api.post(`/messages/${activeConvId}`, { content: msg.content });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: data._id,
                timestamp: new Date(data.createdAt).getTime(),
                status: data.status,
              }
            : m
        )
      );
    } catch (error) {
      console.error('Failed to send message', error);
    }
  }, [newMessage, activeConvId, user]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ═══════ Sidebar: Conversations ═══════ */}
      <section className="w-full md:w-80 flex flex-col bg-surface-container-low border-r border-outline-variant/10">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-on-surface">Messages</h1>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              title="New message"
            >
              <span className="material-symbols-outlined text-[20px]">edit_square</span>
            </button>
          </div>

          {/* Search for new conversation */}
          {showSearch && (
            <div className="mb-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search users to message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              {searching && (
                <p className="text-xs text-on-surface-variant py-2 px-2">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-surface-container-lowest rounded-xl border border-outline-variant/10 max-h-48 overflow-y-auto">
                  {searchResults.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => startConversationWith(u)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-on-surface">{u.name}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {u.isOnline ? '🟢 Online' : 'Offline'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && !searching && searchResults.length === 0 && (
                <p className="text-xs text-on-surface-variant py-2 px-2">No users found.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
                chat_bubble
              </span>
              <p className="text-sm text-on-surface-variant">No conversations yet.</p>
              <p className="text-xs text-outline mt-1">
                Click the ✏️ button above to start one!
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-3 rounded-xl mb-1 flex items-center gap-3 cursor-pointer transition-all ${
                  conv.id === activeConvId
                    ? 'bg-surface-container-lowest shadow-sm'
                    : 'hover:bg-surface-container-high'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface-container-low" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-on-surface truncate">
                      {conv.user.name}
                    </h3>
                    <span
                      className={`text-[10px] flex-shrink-0 ${
                        conv.unread ? 'text-primary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${
                      conv.unread
                        ? 'text-on-surface font-medium'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ═══════ Chat Window ═══════ */}
      <section className="flex-1 flex flex-col bg-surface-container-lowest hidden md:flex">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.user.avatar}
                  alt={activeConv.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-sm font-bold text-on-surface">
                    {activeConv.user.name}
                  </h2>
                  <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium">
                    {activeConv.user.isOnline ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Online now
                      </>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-surface-container rounded-full text-outline transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </button>
                <button className="p-2 hover:bg-surface-container rounded-full text-outline transition-colors">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-outline/30 mb-2 block">
                      waving_hand
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Say hello to {activeConv.user.name}!
                    </p>
                  </div>
                </div>
              )}
              {messages.map((msg) =>
                msg.isOwn ? (
                  <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[75%]">
                    <div className="bg-gradient-to-br from-primary to-primary-container text-white px-4 py-2.5 rounded-2xl rounded-br-none text-sm shadow-md shadow-primary/10 leading-relaxed">
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[10px] text-outline">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {msg.status === 'read' && (
                        <span
                          className="material-symbols-outlined text-[10px] text-primary"
                          style={{ fontVariationSettings: "'wght' 700" }}
                        >
                          done_all
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex items-end gap-3 max-w-[75%]">
                    <img
                      src={activeConv.user.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="bg-surface-container-low text-on-surface-variant px-4 py-2.5 rounded-2xl rounded-bl-none text-sm leading-relaxed">
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-outline px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest shrink-0">
              <div className="flex items-center gap-2 bg-surface-container-low rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <button className="p-1.5 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 py-2 text-sm placeholder:text-outline-variant outline-none"
                />
                <button className="p-1.5 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mood</span>
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-40"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    send
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-outline/20 mb-3 block">
                forum
              </span>
              <p className="text-on-surface-variant font-medium">Your messages</p>
              <p className="text-xs text-outline mt-1">
                Select a conversation or start a new one
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                New Message
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
