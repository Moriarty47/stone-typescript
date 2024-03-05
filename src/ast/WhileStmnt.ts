import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import Environment from '../environment/Environment';
import BasicEvaluator from '../environment/BasicEvaluator';

export default class WhileStmnt extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public condition(): ASTree { return this.child(0); }

  public body(): ASTree { return this.child(1); }

  public toString(): string {
    return `(while ${this.condition()} ${this.body()})`;
  }

  public eval(env: Environment) {
    let result = 0;
    for (; ;) {
      const c = this.condition().eval(env);
      if (typeof c === 'number' && c === BasicEvaluator.FALSE) {
        return result;
      }
      result = this.body().eval(env);
    }
  }
};