import Lexer from '../Lexer';
import List from '../utils/List';
import ASTree from '../ast/ASTree';
import ASTLeaf from '../ast/ASTLeaf';
import HashSet from '../utils/HashSet';
import ArrayList from '../utils/ArrayList';
import { useParseException } from '../exceptions/ParseException';
import { Element, Expr, Factory, IdToken, Leaf, NumToken, Operators, OrTree, Repeat, Skip, StrToken, Tree } from './ParserEle';

export default class Parser<T extends ASTree = ASTree> {
  static rule<T extends ASTree>(clazz?: T) {
    return new Parser(clazz);
  }

  protected elements!: List<Element>;
  protected factory!: Factory;

  constructor(clazz?: T | Parser) {
    if (clazz instanceof Parser) {
      this.elements = clazz.elements;
      this.factory = clazz.factory;
    } else {
      this.reset(clazz);
    }
  }

  reset(clazz?: T) {
    this.elements = new ArrayList<Element>();
    this.factory = Factory.getForASTList(clazz);
    return this;
  }

  @useParseException()
  parse(lexer: Lexer): ASTree {
    const results = new ArrayList<ASTree>();
    for (const e of this.elements) {
      e.parse(lexer, results);
    }
    return this.factory.make(results);
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    if (this.elements.size() === 0) return true;
    const e = this.elements.get(0);
    return e.match(lexer);
  }

  number<T extends ASTLeaf>(clazz: T): Parser {
    this.elements.add(new NumToken(clazz || null));
    return this;
  }

  identifier<T extends ASTLeaf>(...args: [HashSet<string>] | [T | null, HashSet<string>]): Parser {
    let [arg1, arg2] = args;
    if (!arg2) {
      arg2 = arg1 as HashSet<string>;
      arg1 = null;
    }
    this.elements.add(new IdToken(arg1 as T, arg2));
    return this;
  }

  string<T extends ASTLeaf>(clazz: T): Parser {
    this.elements.add(new StrToken(clazz || null));
    return this;
  }

  token(...pat: string[]): Parser {
    this.elements.add(new Leaf(pat));
    return this;
  }

  sep(...pat: string[]): Parser {
    this.elements.add(new Skip(pat));
    return this;
  }

  ast(p: Parser): Parser {
    this.elements.add(new Tree(p));
    return this;
  }

  or(...ps: Parser[]): Parser {
    this.elements.add(new OrTree(ps));
    return this;
  }

  maybe(p: Parser): Parser {
    const p2 = new Parser(p);
    p2.reset();
    this.elements.add(new OrTree([new Parser(p), new Parser(p2)]));
    return this;
  }

  option(p: Parser): Parser {
    this.elements.add(new Repeat(p, true));
    return this;
  }

  repeat(p: Parser): Parser {
    this.elements.add(new Repeat(p, false));
    return this;
  }

  expression<T extends ASTree>(...args: [Parser, Operators] | [T | null, Parser, Operators]): Parser {
    let [arg1, arg2, arg3] = args;
    if (!arg3) {
      arg3 = arg2 as Operators;
      arg2 = arg1 as Parser;
      arg1 = null;
    }
    this.elements.add(new Expr(arg1 as T, arg2 as Parser, arg3));
    return this;
  }

  insertChoice(p: Parser): Parser {
    const e = this.elements.get(0);
    if (e instanceof OrTree) {
      e.insert(p);
    } else {
      const otherwise = new Parser(this);
      this.reset();
      this.or(p, otherwise);
    }
    return this;
  }
};