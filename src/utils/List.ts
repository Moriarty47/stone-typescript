export default class List<T> implements Iterable<T> {
  items: T[] = [];

  add(...args: [T] | [number, T]): boolean {
    if (args.length === 1) {
      return !!this.items.push(args[0]);
    }
    return !!this.items.splice(args[0], 0, args[1]);
  }

  addAll(list: List<T>): boolean {
    return !!this.items.push(...list.items);
  }

  get(i: number): T {
    return this.items[i];
  }

  set(i: number, item: T) {
    this.items[i] = item;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return this.items;
  }

  equals(list: List<object>): boolean {
    if (this.size() !== list.size()) return false;

    for (let i = 0, len = this.size(); i < len; i += 1) {
      if (this.get(i) !== list.get(i)) return false;
    }

    return true;
  }

  indexOf(item: T): number {
    return this.items.indexOf(item);
  }

  lastIndexOf(item: T): number {
    return this.items.lastIndexOf(item);
  }

  contains(item: object): boolean {
    return this.items.includes(item as T);
  }

  containsAll(list: List<object>): boolean {
    for (let i = 0, len = list.size(); i < len; i += 1) {
      const item = list.get(i);
      if (!this.contains(item)) return false;
    }
    return true;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items.length = 0;
  }

  remove(i: number): T {
    const oldVal = this.items[i];
    this.items.splice(i, 1);
    return oldVal;
  }

  removeAll(list: List<T>): boolean {
    for (let i = 0; i < this.size(); i += 1) {
      const item = this.items[i];
      if (list.contains(item as object)) {
        this.remove(i--);
      }
    }
    return true;
  }

  [Symbol.iterator](): Iterator<T> {
    const self = this;
    let i = 0;

    return {
      next() {
        return i < self.size()
          ? { done: false, value: self.items[i++] }
          : { done: true, value: undefined };
      },
    };
  }
};