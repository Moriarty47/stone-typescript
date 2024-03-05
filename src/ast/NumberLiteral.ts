import Token from '../Token';
import ASTLeaf from './ASTLeaf';
import Environment from '../environment/Environment';

export default class NumberLiteral extends ASTLeaf {
  constructor(t: Token) {
    super(t);
  }

  public value(): number {
    return this.token().getNumber();
  }

  public eval(env: Environment): any { return this.value(); }
};