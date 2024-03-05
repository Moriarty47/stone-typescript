import ASTree from './ASTree';
import ASTList from './ASTList';
import Postfix from './Postfix';
import List from '../utils/List';
import Environment from '../environment/Environment';

export default class PrimaryExpr extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public create(list: List<ASTree>): ASTree {
    return list.size() === 1 ? list.get(0) : new PrimaryExpr(list);
  }

  public operand(): ASTree { return this.child(0); }

  public postfix(nest: number): Postfix {
    return this.child((this.numChildren() - nest) - 1) as unknown as Postfix;
  }

  public hasPostfix(nest: number): boolean {
    return (this.numChildren() - nest) > 1;
  }

  public evalSubExpr(env: Environment, nest: number): object {
    if (this.hasPostfix(nest)) {
      const target = this.evalSubExpr(env, nest + 1);
      return this.postfix(nest).eval(env, target);
    }
    return this.operand().eval(env);
  }

  public eval(env: Environment) {
    return this.evalSubExpr(env, 0);
  }
};