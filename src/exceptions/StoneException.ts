import ASTree from '../ast/ASTree';

export default class StoneException extends Error {
  constructor(message: string, astree?: ASTree) {
    if (astree) {
      super(message + ' ' + astree.location());
    } else {
      super(message);
    }
  }
};