// ============================================
// Trie (Prefix Tree) – Search Autocomplete
// ============================================
// Time Complexity: Insert O(m), Search O(m + k) where m = word length, k = results
// Space Complexity: O(n * m) where n = number of words

export interface TrieEntry<T> {
  word: string;
  data: T;
}

class TrieNode<T> {
  children: Map<string, TrieNode<T>> = new Map();
  isEnd: boolean = false;
  entries: TrieEntry<T>[] = [];
}

export class Trie<T> {
  private root: TrieNode<T> = new TrieNode<T>();

  /** Insert a word with associated data into the trie */
  insert(word: string, data: T): void {
    let current = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode<T>());
      }
      current = current.children.get(char)!;
    }

    current.isEnd = true;
    current.entries.push({ word, data });
  }

  /** Search for all entries matching a given prefix */
  searchPrefix(prefix: string): TrieEntry<T>[] {
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();

    // Traverse to the prefix node
    for (const char of lowerPrefix) {
      if (!current.children.has(char)) {
        return []; // No matches
      }
      current = current.children.get(char)!;
    }

    // Collect all entries in subtree using DFS
    return this.collectEntries(current);
  }

  /** DFS to collect all entries from a given node downward */
  private collectEntries(node: TrieNode<T>): TrieEntry<T>[] {
    const results: TrieEntry<T>[] = [];

    if (node.isEnd) {
      results.push(...node.entries);
    }

    for (const [, child] of node.children) {
      results.push(...this.collectEntries(child));
    }

    return results;
  }

  /** Check if a word exists exactly in the trie */
  has(word: string): boolean {
    let current = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }

    return current.isEnd;
  }
}
