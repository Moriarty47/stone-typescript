import Token from '../Token';
import ASTree from './ASTree';
import ArrayList from '../utils/ArrayList';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';

export default class ASTLeaf extends ASTree {
  private empty: ArrayList<ASTree> = new ArrayList<ASTree>();
  protected _token: Token;
  constructor(t: Token) {
    super();
    this._token = t;
  }

  public child(i: number): ASTree {
    throw new StoneException('index out of bounds');
  }

  public numChildren(): number {
    return 0;
  }
  
  public size(): number {
    return this.numChildren();
  }

  public children(): Iterator<ASTree, any, undefined> {
    return this.empty[Symbol.iterator]();
  }

  public location(): string {
    return "at line " + this._token.getLineNumber();
  }

  public token(): Token {
    return this._token;
  }

  public toString(): string {
    return this._token.getText();
  }

  public eval(env: Environment): any {
    throw new StoneException('cannot eval: ' + this.toString(), this);
  }
};