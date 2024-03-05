import Token from '../Token';
import ASTLeaf from './ASTLeaf';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';

export default class Name extends ASTLeaf {
  constructor(t: Token) {
    super(t);
  }

  public name(): string {
    return this.token().getText();
  }

  public eval(env: Environment): any {
    const value = env.get(this.name());
    if (value === undefined) {
      throw new StoneException('undefined name: ' + this.name(), this);
    }
    return value;
  }
};