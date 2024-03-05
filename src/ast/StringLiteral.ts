import Token from '../Token';
import ASTLeaf from './ASTLeaf';
import Environment from '../environment/Environment';

export default class StringLiteral extends ASTLeaf {
  constructor(t: Token) {
    super(t);
  }
  public value(): string { return this.token().getText(); }
  
  public eval(env: Environment): any { return this.value(); }
};