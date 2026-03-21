// ============================================
// Doubly Linked List – Conversation Ordering
// ============================================
// O(1) move-to-front when a conversation receives a new message
// O(1) insertion at head, O(n) lookup by key (with Map for O(1))

export class LinkedListNode<T> {
  data: T;
  prev: LinkedListNode<T> | null = null;
  next: LinkedListNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> {
  head: LinkedListNode<T> | null = null;
  tail: LinkedListNode<T> | null = null;
  private nodeMap: Map<string, LinkedListNode<T>> = new Map();
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  /** Add a new item to the front of the list */
  addFirst(key: string, data: T): LinkedListNode<T> {
    const node = new LinkedListNode(data);
    node.next = this.head;

    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    this.nodeMap.set(key, node);
    this._size++;
    return node;
  }

  /** Add a new item to the end of the list */
  addLast(key: string, data: T): LinkedListNode<T> {
    const node = new LinkedListNode(data);
    node.prev = this.tail;

    if (this.tail) {
      this.tail.next = node;
    }
    this.tail = node;

    if (!this.head) {
      this.head = node;
    }

    this.nodeMap.set(key, node);
    this._size++;
    return node;
  }

  /** Move an existing node to the front in O(1) */
  moveToFront(key: string): void {
    const node = this.nodeMap.get(key);
    if (!node || node === this.head) return;

    // Detach from current position
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.tail) this.tail = node.prev;

    // Reattach at head
    node.prev = null;
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
  }

  /** Remove a node by key */
  remove(key: string): T | null {
    const node = this.nodeMap.get(key);
    if (!node) return null;

    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;

    this.nodeMap.delete(key);
    this._size--;
    return node.data;
  }

  /** Get a node's data by key in O(1) */
  get(key: string): T | undefined {
    return this.nodeMap.get(key)?.data;
  }

  /** Update a node's data by key */
  update(key: string, data: T): boolean {
    const node = this.nodeMap.get(key);
    if (!node) return false;
    node.data = data;
    return true;
  }

  /** Convert to array (head to tail order) */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}
