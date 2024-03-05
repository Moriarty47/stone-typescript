import Fun from '../ast/Fun';
import Parser from './Parser';
import FuncParser from './FuncParser';

export default class ClosureParser extends FuncParser {
  constructor() {
    super();
    this.primary.insertChoice(
      Parser.rule(Fun.prototype)
        .sep('fun')
        .ast(this.paramList)
        .ast(this.block)
    );
  }
};