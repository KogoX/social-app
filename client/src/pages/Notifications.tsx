import { useState, useEffect, useMemo } from 'react';
import type { Notification } from '../types';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// ===== DSA: HashMap (Map) for Notification Grouping =====
// Groups notifications into time-based buckets using Map for O(1) per-item classification
function groupNotifications(notifications: Notification[]): Map<string, Notification[]> {
  const groups = new Map<string, Notification[]>();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  for (const notification of notifications) {
    const age = now - notification.timestamp;
    let bucket: string;

    if (age < oneDayMs) {
      bucket = 'Today';
    } else if (age < oneWeekMs) {
      bucket = 'This Week';
    } else {
      bucket = 'Earlier';
    }

    if (!groups.has(bucket)) {
      groups.set(bucket, []);
    }
    groups.get(bucket)!.push(notification);
  }

  return groups;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        const formatted = data.map((n: any) => ({
          id: n._id,
          user: {
             name: n.relatedUser?.name || 'Unknown',
             avatar: n.relatedUser?.avatar || 'https://via.placeholder.com/150'
          },
          content: n.content,
          quote: n.quote,
          timestamp: new Date(n.createdAt).getTime(),
          isRead: n.isRead,
          actionIcon: n.actionIcon || 'favorite',
          actionColor: n.actionColor || 'bg-red-500'
        }));
        setNotifications(formatted);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await handleMarkAsRead(n.id);
    }
  };

  // Group notifications using HashMap
  const groupedNotifications = useMemo(
    () => groupNotifications(notifications),
    [notifications]
  );

  // Ordered bucket keys for display
  const bucketOrder = ['Today', 'This Week', 'Earlier'];

  return (
    <div className="px-4 md:px-8 flex justify-center pt-8">
      <div className="w-full max-w-[680px]">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-on-surface">Notifications</h1>
          <button onClick={handleMarkAllAsRead} className="text-primary hover:text-primary-container text-sm font-medium transition-colors">
            Mark all as read
          </button>
        </header>

        <div className="flex flex-col gap-8">
          {loading ? (
            <div className="text-center py-8 text-on-surface-variant">Loading notifications...</div>
          ) : (
            bucketOrder.map(bucket => {
              const items = groupedNotifications.get(bucket);
              if (!items || items.length === 0) return null;

              return (
              <section key={bucket}>
                <h2 className="text-on-surface font-semibold text-sm mb-4 tracking-wide">{bucket}</h2>
                <div className="flex flex-col gap-1">
                  {items.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                      className={`group flex items-center gap-4 p-4 rounded-xl transition-colors relative overflow-hidden cursor-pointer ${
                        !notification.isRead
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      {!notification.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                      )}
                      <div className="relative">
                        <img
                          src={notification.user.avatar}
                          alt={notification.user.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 ${notification.actionColor} p-1 rounded-full border-2 border-surface-container-lowest`}>
                          <span
                            className="material-symbols-outlined text-[12px] text-white"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {notification.actionIcon}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-on-surface-variant">
                          <span className="font-bold text-on-surface">{notification.user.name}</span>{' '}
                          <span dangerouslySetInnerHTML={{ __html: notification.content }} />
                        </p>
                        {notification.quote && (
                          <div className="mt-2 p-3 bg-surface-container rounded-lg italic text-xs border-l-2 border-outline-variant">
                            "{notification.quote}"
                          </div>
                        )}
                        <span className="text-xs text-outline mt-1 block">{timeAgo(notification.timestamp)}</span>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
