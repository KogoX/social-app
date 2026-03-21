import { useState } from 'react';
import type { FriendRequest } from '../types';
import api from '../utils/api';

interface FriendCardProps {
  request: FriendRequest;
  variant?: 'request' | 'suggestion';
}

export default function FriendCard({ request, variant = 'request' }: FriendCardProps) {
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await api.put(`/users/${request.id}/follow`);
      setFollowed(true);
    } catch (error) {
      console.error('Failed to follow user', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (declined) return null;

  if (variant === 'suggestion') {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-4 flex gap-4 items-center shadow-sm hover:bg-surface-bright transition-all">
        <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
          <img src={request.user.avatar} alt={request.user.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-semibold text-on-surface truncate">{request.user.name}</h4>
          <p className="text-xs text-on-surface-variant mb-2">{request.mutualFriends} mutual friends</p>
          <button 
            onClick={handleFollow}
            disabled={loading || followed}
            className={`text-xs font-bold flex items-center gap-1 ${followed ? 'text-on-surface-variant' : 'text-primary hover:text-primary-container'}`}
          >
            <span className="material-symbols-outlined text-sm">{followed ? 'check' : 'person_add'}</span>
            {followed ? 'Following' : 'Add Friend'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src={request.coverImage} alt={request.user.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-on-surface mb-1">{request.user.name}</h3>
        <p className="text-xs text-on-surface-variant mb-4">{request.mutualFriends} mutual friends</p>
        <div className="flex flex-col gap-2">
          {!followed ? (
            <>
              <button onClick={handleFollow} disabled={loading} className="w-full py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-container transition-colors disabled:opacity-50">
                {loading ? 'Accepting...' : 'Accept'}
              </button>
              <button onClick={handleDecline} className="w-full py-2 bg-surface-container-highest text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-variant transition-colors">
                Decline
              </button>
            </>
          ) : (
            <button disabled className="w-full py-2 bg-surface-container-highest text-on-surface-variant rounded-lg font-semibold text-sm">
              Accepted
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
