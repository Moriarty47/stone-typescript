import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import BlockStmnt from './BlockStmnt';
import ParameterList from './ParameterList';
import Function from '../environment/Function';
import Environment from '../environment/Environment';

export default class Fun extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public parameters(): ParameterList {
    return (this.child(0) as ParameterList);
  }

  public body(): BlockStmnt {
    return (this.child(0) as BlockStmnt);
  }

  public toString(): string {
    return `(fun ${this.parameters()} ${this.body()})`;
  }

  public eval(env: Environment) {
    return new Function(this.parameters(), this.body(), env);
  }
};