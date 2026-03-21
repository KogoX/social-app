// ============================================
// Social Graph – Friend Suggestions via BFS
// ============================================
// Uses adjacency list (Map<string, Set<string>>) for O(1) edge lookup
// BFS traversal finds friends-of-friends at distance 2 for suggestions
// Time: O(V + E) for BFS, Space: O(V) for visited set

export interface FriendSuggestion {
  userId: string;
  mutualFriends: string[];
  mutualCount: number;
}

export class SocialGraph {
  private adjacencyList: Map<string, Set<string>> = new Map();

  /** Add a user node to the graph */
  addUser(userId: string): void {
    if (!this.adjacencyList.has(userId)) {
      this.adjacencyList.set(userId, new Set());
    }
  }

  /** Add bidirectional friendship edge */
  addFriendship(userA: string, userB: string): void {
    this.addUser(userA);
    this.addUser(userB);
    this.adjacencyList.get(userA)!.add(userB);
    this.adjacencyList.get(userB)!.add(userA);
  }

  /** Get direct friends of a user */
  getFriends(userId: string): string[] {
    return Array.from(this.adjacencyList.get(userId) || []);
  }

  /** Check if two users are friends */
  areFriends(userA: string, userB: string): boolean {
    return this.adjacencyList.get(userA)?.has(userB) ?? false;
  }

  /**
   * BFS-based friend suggestion algorithm
   * Finds users at distance exactly 2 (friends-of-friends)
   * and ranks them by number of mutual connections
   */
  getSuggestions(userId: string, maxResults: number = 10): FriendSuggestion[] {
    const directFriends = this.adjacencyList.get(userId);
    if (!directFriends) return [];

    // BFS with distance tracking
    const visited = new Set<string>([userId]);
    const queue: Array<{ node: string; distance: number }> = [];
    const mutualMap = new Map<string, string[]>(); // userId -> mutual friend names

    // Initialize queue with direct friends (distance 1)
    for (const friend of directFriends) {
      visited.add(friend);
      queue.push({ node: friend, distance: 1 });
    }

    // Process BFS queue
    let front = 0;
    while (front < queue.length) {
      const { node, distance } = queue[front++];

      if (distance >= 2) continue; // Only explore up to distance 2

      const neighbors = this.adjacencyList.get(node);
      if (!neighbors) continue;

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          // This is a friend-of-friend (distance 2) — a suggestion
          if (!mutualMap.has(neighbor)) {
            mutualMap.set(neighbor, []);
          }
          mutualMap.get(neighbor)!.push(node); // node is the mutual friend
          // Don't mark visited yet so other paths can contribute mutual counts
        }
      }

      // Mark distance-1 nodes' neighbors as potential suggestions
      if (distance === 1) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && !directFriends.has(neighbor)) {
            // Will be processed as suggestion, not traversed further
          }
        }
      }
    }

    // Build suggestion list sorted by mutual friend count (descending)
    const suggestions: FriendSuggestion[] = [];
    for (const [suggestedId, mutuals] of mutualMap) {
      // Deduplicate mutual friends
      const uniqueMutuals = [...new Set(mutuals)];
      suggestions.push({
        userId: suggestedId,
        mutualFriends: uniqueMutuals,
        mutualCount: uniqueMutuals.length,
      });
    }

    // Sort by mutual count descending
    suggestions.sort((a, b) => b.mutualCount - a.mutualCount);

    return suggestions.slice(0, maxResults);
  }

  /** Get count of users in the graph */
  get size(): number {
    return this.adjacencyList.size;
  }
}
