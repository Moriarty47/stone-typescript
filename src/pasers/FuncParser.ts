import Parser from './Parser';
import DefStmnt from '../ast/DefStmnt';
import BasicParser from './BasicParser';
import Arguments from '../ast/Arguments';
import ParameterList from '../ast/ParameterList';

export default class FuncParser extends BasicParser {
  param = Parser.rule().identifier(this.reserved);

  params = Parser.rule(ParameterList.prototype)
    .ast(this.param).repeat(Parser.rule().sep(',').ast(this.param));

  paramList = Parser.rule().sep('(').maybe(this.params).sep(')');

  def = Parser.rule(DefStmnt.prototype)
    .sep('def').identifier(this.reserved).ast(this.paramList).ast(this.block);

  args = Parser.rule(Arguments.prototype)
    .ast(this.expr).repeat(Parser.rule().sep(',').ast(this.expr));

  postfix = Parser.rule().sep('(').maybe(this.args).sep(')');

  constructor() {
    super();
    this.reserved.add(')');
    this.primary.repeat(this.postfix);
    this.simple.option(this.args);
    this.program.insertChoice(this.def);
  }
};