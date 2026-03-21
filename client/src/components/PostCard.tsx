import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: any;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();

  const [likes, setLikes] = useState<number>(
    Array.isArray(post.likes) ? post.likes.length : post.likes || 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(
    Array.isArray(post.likes) ? post.likes.includes(user?._id) : false
  );

  // Comments state
  const [comments, setComments] = useState<any[]>(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // When post data changes, update comments
  useEffect(() => {
    if (post.comments) {
      setComments(post.comments);
    }
  }, [post.comments]);

  const handleLike = async () => {
    try {
      const { data } = await api.put(`/posts/${post.id || post._id}/like`);
      setLikes(data.length);
      setIsLiked(data.includes(user?._id));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${post.id || post._id}/comments`, {
        content: commentText,
      });
      setComments(data);
      setCommentText('');
    } catch (error) {
      console.error('Failed to comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  return (
    <article className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-sm font-bold text-on-surface">{post.author?.name}</h3>
              <p className="text-[10px] text-on-surface-variant font-medium">
                {timeAgo(post.timestamp)} •{' '}
                <span className="material-symbols-outlined text-[12px]">
                  {post.visibility === 'public' ? 'public' : 'group'}
                </span>
              </p>
            </div>
          </div>
          <button className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Content */}
        {post.image ? (
          <>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{post.content}</p>
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={post.image} alt="Post content" className="w-full h-80 object-cover" />
            </div>
          </>
        ) : (
          <p className="text-lg font-medium text-on-surface leading-snug">{post.content}</p>
        )}

        {/* Stats bar */}
        <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-white">
                <span
                  className="material-symbols-outlined text-[10px] text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  thumb_up
                </span>
              </div>
              {likes > 1 && (
                <div className="w-5 h-5 rounded-full bg-tertiary flex items-center justify-center ring-2 ring-white">
                  <span
                    className="material-symbols-outlined text-[10px] text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-on-surface-variant">
              {likes} {likes === 1 ? 'like' : 'likes'}
            </span>
          </div>
          <div className="flex gap-4">
            {comments.length > 0 && (
              <button
                onClick={toggleComments}
                className="text-[11px] text-on-surface-variant hover:underline"
              >
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </button>
            )}
            {post.shares > 0 && (
              <span className="text-[11px] text-on-surface-variant">{post.shares} shares</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 mt-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-surface-container-low transition-colors ${
              isLiked ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              thumb_up
            </span>
            <span className="text-xs font-semibold">Like</span>
          </button>
          <button
            onClick={toggleComments}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-surface-container-low transition-colors ${
              showComments ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
            <span className="text-xs font-semibold">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span className="text-xs font-semibold">Share</span>
          </button>
        </div>

        {/* ════ Comment Section ════ */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10 space-y-3">
            {/* Existing comments */}
            {comments.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments.map((comment: any, idx: number) => (
                  <div key={comment._id || idx} className="flex gap-2.5">
                    <img
                      src={comment.author?.avatar || user?.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="bg-surface-container-low rounded-2xl px-3.5 py-2">
                        <p className="text-xs font-bold text-on-surface">
                          {comment.author?.name || 'User'}
                        </p>
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-2">
                        <span className="text-[10px] text-outline">
                          {comment.timestamp
                            ? timeAgo(new Date(comment.timestamp).getTime())
                            : 'Just now'}
                        </span>
                        <button className="text-[10px] text-on-surface-variant font-semibold hover:text-primary">
                          Like
                        </button>
                        <button className="text-[10px] text-on-surface-variant font-semibold hover:text-primary">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Write comment input */}
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-full px-3.5 py-1.5">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-1 placeholder:text-outline outline-none"
                />
                <button className="p-1 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">mood</span>
                </button>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submitting}
                  className="text-primary disabled:text-outline transition-colors"
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
          </div>
        )}
      </div>
    </article>
  );
}
