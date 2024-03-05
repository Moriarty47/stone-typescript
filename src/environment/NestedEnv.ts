import { Env } from './FuncEvaluator';
import HashMap from '../utils/HashMap';
import Environment from './Environment';

export default class NestedEnv {
  protected values = new HashMap<string, object>();
  protected outer: Environment | undefined;
  constructor(e?: Environment) {
    this.outer = e;
  }

  public setOuter(e: Environment) { this.outer = e; }

  public get(name: string): object {
    const v = this.values.get(name);
    if (v === undefined && this.outer) return this.outer.get(name);
    return v;
  }

  public putNew(name: string, value: object) {
    this.values.put(name, value);
  }

  public put(name: string, value: object) {
    let e = this.where(name);
    if (!e) e = this;
    (e as Env).putNew(name, value);
  }

  public where(name: string): Environment | null {
    if (this.values.get(name)) return this;
    else if (!this.outer) return null;
    return (this.outer as Env).where(name);
  }
};