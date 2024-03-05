import ASTree from './ASTree';
import ASTList from './ASTList';
import ASTLeaf from './ASTLeaf';
import List from '../utils/List';
import { Env } from '../environment/FuncEvaluator';
import Environment from '../environment/Environment';

export default class ParameterList extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public name(i: number): string {
    return (this.child(i) as ASTLeaf).token().getText();
  }

  public size(): number { return this.numChildren(); }

  public eval(env: Environment, index: number, value: object) {
    (env as Env).putNew(this.name(index), value);
  }
};