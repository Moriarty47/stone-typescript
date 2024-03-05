import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';

export default class NegativeExpr extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }
  public operand(): ASTree { return this.child(0); }

  public toString(): string { return '-' + this.operand(); }

  public eval(env: Environment) {
    const v = this.operand().eval(env);
    if (typeof v === 'number') {
      return -v;
    }
    throw new StoneException('bad type for -', this);
  }
};