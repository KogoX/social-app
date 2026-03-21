// ============================================
// Sorting & Searching Algorithms
// ============================================

// --- Merge Sort ---
// Stable sort with O(n log n) guaranteed time complexity
// Used for ranking feed posts by composite score

/**
 * Generic merge sort implementation
 * @param arr Array to sort
 * @param compareFn Comparison function (negative = a first, positive = b first)
 * @returns New sorted array (does not mutate input)
 */
export function mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);

  return merge(left, right, compareFn);
}

function merge<T>(left: T[], right: T[], compareFn: (a: T, b: T) => number): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Append remaining elements
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// --- Feed Post Ranking ---
// Composite score: recency weight + engagement weight

export interface RankablePost {
  id: string;
  timestamp: number;   // Unix timestamp ms
  likes: number;
  comments: number;
  shares: number;
}

/**
 * Calculate composite ranking score for a post
 * Higher score = higher in feed
 */
export function calculatePostScore(post: RankablePost, now: number = Date.now()): number {
  const ageHours = (now - post.timestamp) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 100 - ageHours * 2); // Decays over time
  const engagementScore = (post.likes * 1) + (post.comments * 3) + (post.shares * 5);
  return recencyScore + engagementScore * 0.1;
}

/**
 * Rank posts using merge sort by composite score
 */
export function rankPosts<T extends RankablePost>(posts: T[]): T[] {
  const now = Date.now();
  return mergeSort(posts, (a, b) => {
    const scoreA = calculatePostScore(a, now);
    const scoreB = calculatePostScore(b, now);
    return scoreB - scoreA; // Descending (highest score first)
  });
}


// --- Binary Search ---
// O(log n) search in sorted arrays
// Used for finding messages by timestamp

/**
 * Binary search for the nearest element by a numeric key
 * Returns the index of the element with the closest key <= target
 */
export function binarySearchNearest<T>(
  arr: T[],
  target: number,
  keyFn: (item: T) => number
): number {
  if (arr.length === 0) return -1;

  let low = 0;
  let high = arr.length - 1;
  let result = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = keyFn(arr[mid]);

    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

/**
 * Find a message by timestamp using binary search
 */
export function findMessageByTimestamp<T extends { timestamp: number }>(
  messages: T[],
  targetTimestamp: number
): T | null {
  const index = binarySearchNearest(messages, targetTimestamp, (m) => m.timestamp);
  return index >= 0 ? messages[index] : null;
}
