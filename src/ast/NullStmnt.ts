import ASTree from './ASTree';
import ASTList from './ASTList';
import List from '../utils/List';

export default class NullStmnt extends ASTList {
  constructor(list: List<ASTree>) {
    super(list);
  }
};