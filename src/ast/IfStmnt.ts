import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import Environment from '../environment/Environment';
import BasicEvaluator from '../environment/BasicEvaluator';

export default class IfStmnt extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }
  public condition(): ASTree { return this.child(0); }

  public thenBlock(): ASTree { return this.child(1); }

  public elseBlock(): ASTree | null { return this.numChildren() > 2 ? this.child(2) : null; }

  public toString(): string {
    return `(if ${this.condition()} ${this.thenBlock()} else ${this.elseBlock()})`;
  }

  public eval(env: Environment) {
    const c = this.condition().eval(env);
    if (typeof c === 'number' && c !== BasicEvaluator.FALSE) {
      return this.thenBlock().eval(env);
    }
    const b = this.elseBlock();
    if (!b) return 0;
    return b.eval(env);
  }
};