import Environment from '../environment/Environment';

export default abstract class ASTree implements Iterable<ASTree>{
  public abstract child(i: number): ASTree;
  public abstract numChildren(): number;
  public abstract size(): number;
  public abstract children(): Iterator<ASTree>;
  public abstract location(): string | null;
  public abstract toString(): string;
  public abstract eval(env: Environment, ...rest: any[]): any;
  public [Symbol.iterator]() { return this.children(); }
  public getMethod(methodName: string, ...args: any[]) {
    if ((this as any)[methodName] instanceof Function) {
      return (this as any)[methodName];
    }
    return null;
  }
  public getClass() {
    return this.constructor;
  }
};