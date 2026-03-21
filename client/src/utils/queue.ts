// ============================================
// Queue (FIFO) – Message Send Buffer
// ============================================
// Enqueue O(1), Dequeue O(1) using circular array or linked approach
// Used for managing outgoing message ordering with optimistic UI

export class Queue<T> {
  private items: T[] = [];
  private front: number = 0;

  /** Add item to the back of the queue – O(1) amortized */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** Remove and return item from the front – O(1) amortized */
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.front];
    this.front++;

    // Reclaim memory when half the array is dequeued
    if (this.front > this.items.length / 2) {
      this.items = this.items.slice(this.front);
      this.front = 0;
    }

    return item;
  }

  /** Peek at the front item without removing it */
  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.front];
  }

  /** Check if the queue is empty */
  isEmpty(): boolean {
    return this.front >= this.items.length;
  }

  /** Get the number of items in the queue */
  get size(): number {
    return this.items.length - this.front;
  }

  /** Convert to array (front to back order) */
  toArray(): T[] {
    return this.items.slice(this.front);
  }

  /** Clear all items from the queue */
  clear(): void {
    this.items = [];
    this.front = 0;
  }
}
