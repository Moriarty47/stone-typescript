import Name from './Name';
import ASTree from './ASTree';
import ASTList from './ASTList';
import ASTLeaf from './ASTLeaf';
import List from '../utils/List';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';
import BasicEvaluator from '../environment/BasicEvaluator';

export default class BinaryExpr extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public left(): ASTree {
    return this.child(0);
  }

  public operator(): string {
    return (this.child(1) as ASTLeaf).token().getText();
  }

  public right(): ASTree {
    return this.child(2);
  }

  protected computeAssign(env: Environment, rVal: object): object {
    const l = this.left();
    if (l instanceof Name) {
      env.put(l.name(), rVal);
      return rVal;
    }
    throw new StoneException('bad assignment', this);
  }

  protected computeOp(left: object, op: string, right: object): object | number | boolean {
    if (typeof left === 'number' && typeof right === 'number') {
      return this.computeNumber(left, op, right);
    }
    if (op === '+') {
      return Number(left) + Number(right);
    } else if (op === '==') {
      if (!left) return !right ? BasicEvaluator.TRUE : BasicEvaluator.FALSE;
      return left === right ? BasicEvaluator.TRUE : BasicEvaluator.FALSE;
    }
    throw new StoneException('bad type', this);
  }

  protected static computeRules: Record<string, (a: number, b: number) => number | boolean> = {
    '+'(a, b) { return a + b; },
    '-'(a, b) { return a - b; },
    '*'(a, b) { return a * b; },
    '/'(a, b) { return a / b; },
    '%'(a, b) { return a % b; },
    '=='(a, b) { return a == b ? BasicEvaluator.TRUE : BasicEvaluator.FALSE; },
    '>'(a, b) { return a > b ? BasicEvaluator.TRUE : BasicEvaluator.FALSE; },
    '<'(a, b) { return a < b ? BasicEvaluator.TRUE : BasicEvaluator.FALSE; },
  };

  protected computeNumber(left: number, op: string, right: number): number | boolean {
    try {
      return BinaryExpr.computeRules[op](left, right);
    } catch {
      throw new StoneException('bad operator', this);
    }
  }

  public eval(env: Environment) {
    const op = this.operator();
    if (op === '=') {
      return this.computeAssign(env, this.right().eval(env));
    }
    return this.computeOp(
      this.left().eval(env),
      op,
      this.right().eval(env)
    );
  }
};