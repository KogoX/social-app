import { useState, useMemo, useCallback, useEffect } from 'react';
import { Trie } from '../utils/trie';
import api from '../utils/api';
import type { User } from '../types';

// ===== DSA: Stack for Search Navigation History =====
class SearchHistoryStack {
  private items: string[] = [];

  push(query: string) {
    if (this.items[this.items.length - 1] !== query) {
      this.items.push(query);
    }
  }

  pop(): string | undefined {
    return this.items.pop();
  }

  peek(): string | undefined {
    return this.items[this.items.length - 1];
  }

  get history(): string[] {
    return [...this.items];
  }

  get size(): number {
    return this.items.length;
  }
}

const searchHistory = new SearchHistoryStack();

export default function Search() {
  const [query, setQuery] = useState('Julian');
  const [activeFilter, setActiveFilter] = useState('People');
  const filters = ['People', 'Posts', 'Photos', 'Pages', 'Groups'];

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(console.error);
  }, []);

  // ===== DSA: Trie for Search Autocomplete =====
  // Build the prefix tree from fetched users
  const trie = useMemo(() => {
    const t = new Trie<any>();
    users.forEach(user => {
      // Insert both full name and individual name parts for flexible matching
      if (user.name) {
        t.insert(user.name, user);
        user.name.split(' ').forEach((part: string) => t.insert(part, user));
      }
    });
    return t;
  }, [users]);

  // Search results from the Trie in O(prefix_length + results)
  const autocompleteResults = useMemo(() => {
    if (!query.trim()) return [];
    const entries = trie.searchPrefix(query.trim());
    // Deduplicate by user id using a Map
    const seen = new Map<string, User>();
    entries.forEach(e => {
      if (!seen.has(e.data.id)) seen.set(e.data.id, e.data);
    });
    return Array.from(seen.values());
  }, [query, trie]);

  const handleSearch = useCallback((newQuery: string) => {
    if (newQuery.trim()) {
      searchHistory.push(newQuery.trim());
    }
    setQuery(newQuery);
  }, []);

  const handleBack = useCallback(() => {
    searchHistory.pop(); // Remove current
    const prev = searchHistory.peek();
    if (prev) setQuery(prev);
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await api.put(`/users/${userId}/follow`);
      alert('Followed successfully!');
    } catch (error) {
      console.error('Failed to follow', error);
    }
  };

  return (
    <div className="px-4 md:px-8 pb-12 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            {searchHistory.size > 1 && (
              <button onClick={handleBack} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">Explore the Gallery</h1>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-2xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)] ring-1 ring-outline-variant/10 focus-within:ring-primary/50 transition-all">
              <div className="pl-4 flex items-center">
                <span className="material-symbols-outlined text-primary text-3xl">search</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-outline/50 outline-none"
                placeholder="Search for curators, exhibits, or stories..."
              />
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold active:scale-95 transition-all">Search</button>
            </div>

            {/* Autocomplete Dropdown (Trie-powered) */}
            {query && autocompleteResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-[0px_16px_48px_rgba(25,28,30,0.1)] overflow-hidden z-20 ring-1 ring-outline-variant/20">
                <div className="p-2 border-b border-outline-variant/5 bg-surface-container-low/30">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-outline px-3">Quick Suggestions</span>
                </div>
                <div className="p-1">
                  {autocompleteResults.slice(0, 5).map(user => (
                    <a key={user.id} href="#" className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-xl transition-colors">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-[11px] text-outline">Digital Creator</div>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-outline/50">north_west</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                activeFilter === f
                  ? 'bg-primary text-on-primary font-semibold shadow-md shadow-primary/20'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {autocompleteResults.slice(0, 4).map(user => (
            <div key={user.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)] group hover:translate-y-[-4px] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
                </div>
                <button className="p-2 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{user.name}</h3>
              <p className="text-sm text-on-surface-variant mb-6">Digital Creator & Curator</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleFollow((user as any)._id || user.id)}
                  className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Add Friend
                </button>
                <button className="w-12 bg-surface-container-high text-on-surface-variant rounded-xl flex items-center justify-center active:scale-95 transition-all">
                  <span className="material-symbols-outlined">chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="mt-12 p-8 bg-surface-container-low rounded-3xl text-center border-2 border-dashed border-outline-variant/20">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl">person_search</span>
          </div>
          <h4 className="text-lg font-bold mb-2">Can't find what you're looking for?</h4>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">Try broadening your search or checking out people you might know.</p>
          <button className="bg-surface-container-highest text-on-surface px-6 py-2 rounded-xl font-bold text-sm hover:bg-outline-variant/40 transition-all">Invite Friends</button>
        </div>
      </div>
    </div>
  );
}
