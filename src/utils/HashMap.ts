export default class HashMap<K, V> {
  map: Map<K, V> = new Map<K, V>();

  put(key: K, value: V): Map<K, V> {
    return this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  containsKey(key: K): boolean {
    return this.map.has(key);
  }

  remove(key: K): boolean {
    return this.map.delete(key);
  }

  size(): number {
    return this.map.size;
  }
};