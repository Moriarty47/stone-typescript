import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import NullStmnt from './NullStmnt';
import Environment from '../environment/Environment';

export default class BlockStmnt extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public eval(env: Environment): object | number {
    let result = 0;
    for (const t of this) {
      if (!(t instanceof NullStmnt)) {
        result = t.eval(env);
      }
    }
    return result;
  }
};