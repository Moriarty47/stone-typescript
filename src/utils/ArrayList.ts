import List from './List';

export default class ArrayList<T> extends List<T> {
  forEach(consumer: (item: T, index: number) => void) {
    for (let i = 0, len = this.items.length; i < len; i += 1) {
      consumer(this.items[i], i);
    }
  };
};