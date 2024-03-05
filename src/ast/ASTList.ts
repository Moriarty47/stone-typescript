import ASTree from './ASTree';
import List from '../utils/List';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';

export default class ASTList extends ASTree {
  protected _children: List<ASTree>;
  constructor(list: List<ASTree>) {
    super();
    this._children = list;
  }

  public child(i: number): ASTree {
    return this._children.get(i);
  }

  public numChildren(): number {
    return this._children.size();
  }

  public size(): number {
    return this.numChildren();
  }

  public children(): Iterator<ASTree, any, undefined> {
    return this._children[Symbol.iterator]();
  }

  public location(): string | null {
    for (const t of this._children) {
      const s = t.location();
      if (s) return s;
    }
    return null;
  }

  public toString(): string {
    let str = '(';
    let sep = '';
    for (const t of this._children) {
      str += sep;
      sep = ' ';
      str += t.toString();
    }
    return str += ')';
  }

  public eval(env: Environment, ...rest: any[]): any {
    throw new StoneException('cannot eval: ' + this.toString(), this);
  }
};