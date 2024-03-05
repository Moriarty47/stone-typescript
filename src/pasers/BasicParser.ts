import Token from '../Token';
import Lexer from '../Lexer';
import Parser from './Parser';
import Name from '../ast/Name';
import ASTree from '../ast/ASTree';
import IfStmnt from '../ast/IfStmnt';
import HashSet from '../utils/HashSet';
import { Operators } from './ParserEle';
import NullStmnt from '../ast/NullStmnt';
import WhileStmnt from '../ast/WhileStmnt';
import BinaryExpr from '../ast/BinaryExpr';
import BlockStmnt from '../ast/BlockStmnt';
import PrimaryExpr from '../ast/PrimaryExpr';
import NegativeExpr from '../ast/NegativeExpr';
import NumberLiteral from '../ast/NumberLiteral';
import StringLiteral from '../ast/StringLiteral';
import { useParseException } from '../exceptions/ParseException';



export default class BasicParser {
  reserved = new HashSet<string>();
  operators = new Operators();
  expr0 = Parser.rule();
  primary = Parser.rule(PrimaryExpr.prototype)
    .or(
      Parser.rule().sep('(').ast(this.expr0).sep(')'),
      Parser.rule().number(NumberLiteral.prototype),
      Parser.rule().identifier(Name.prototype, this.reserved),
      Parser.rule().string(StringLiteral.prototype)
    );

  factor = Parser.rule().or(
    Parser.rule(NegativeExpr.prototype).sep('-').ast(this.primary),
    this.primary
  );

  expr = this.expr0.expression(BinaryExpr.prototype, this.factor, this.operators);

  statement0 = Parser.rule();

  block = Parser.rule(BlockStmnt.prototype)
    .sep('{').option(this.statement0)
    .repeat(Parser.rule().sep(';', Token.EOL).option(this.statement0))
    .sep('}');

  simple = Parser.rule(PrimaryExpr.prototype).ast(this.expr);

  statement = this.statement0.or(
    Parser.rule(IfStmnt.prototype)
      .sep('if')
      .ast(this.expr)
      .ast(this.block)
      .option(Parser.rule().sep('else').ast(this.block)),
    Parser.rule(WhileStmnt.prototype)
      .sep('while')
      .ast(this.expr)
      .ast(this.block),
    this.simple
  );

  program = Parser.rule().or(this.statement, Parser.rule(NullStmnt.prototype))
    .sep(';', Token.EOL);

  constructor() {
    this.reserved.add(';');
    this.reserved.add('}');
    this.reserved.add(Token.EOL);

    this.operators.add('=', 1, Operators.RIGHT);
    this.operators.add('==', 2, Operators.LEFT);
    this.operators.add(">", 2, Operators.LEFT);
    this.operators.add("<", 2, Operators.LEFT);
    this.operators.add("+", 3, Operators.LEFT);
    this.operators.add("-", 3, Operators.LEFT);
    this.operators.add("*", 4, Operators.LEFT);
    this.operators.add("/", 4, Operators.LEFT);
    this.operators.add("%", 4, Operators.LEFT);
  }

  @useParseException()
  parse(lexer: Lexer): ASTree {
    return this.program.parse(lexer);
  }
};