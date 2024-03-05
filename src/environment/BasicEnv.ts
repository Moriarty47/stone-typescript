import HashMap from '../utils/HashMap';
import Environment from './Environment';

export default class BasicEnv implements Environment {
  protected values = new HashMap<string, object>();

  put(name: string, value: object): void {
    this.values.put(name, value);
  }

  get(name: string): object {
    return this.values.get(name);
  }
};