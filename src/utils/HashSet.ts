export default class HashSet<T> {
  set: Set<T> = new Set<T>();

  add(value: T): Set<T> {
    return this.set.add(value);
  }

  contains(value: T): boolean {
    return this.set.has(value);
  }

  remove(value: T): boolean {
    return this.set.delete(value);
  }

  size(): number {
    return this.set.size;
  }
};