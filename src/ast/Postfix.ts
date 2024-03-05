import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';
import Environment from '../environment/Environment';

export default abstract class Postfix extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public abstract eval(env: Environment, value: object): object;
};