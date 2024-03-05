import ASTree from './ASTree';
import ASTList from './ASTList';
import ASTLeaf from './ASTLeaf';
import List from '../utils/List';
import BlockStmnt from './BlockStmnt';
import ParameterList from './ParameterList';
import Function from '../environment/Function';
import { Env } from '../environment/FuncEvaluator';
import Environment from '../environment/Environment';

export default class DefStmnt extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public name(): string {
    return (this.child(0) as ASTLeaf).token().getText();
  }

  public parameters(): ParameterList {
    return (this.child(1) as ParameterList);
  }

  public body(): BlockStmnt {
    return (this.child(2) as BlockStmnt);
  }

  public toString(): string {
    return `(def ${this.name()} ${this.parameters()} ${this.body()})`;
  }

  public eval(env: Environment) {
    (env as Env).putNew(this.name(), new Function(this.parameters(), this.body(), env));
    return this.name();
  }
};