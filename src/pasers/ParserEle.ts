import Token from '../Token';
import Lexer from '../Lexer';
import Parser from './Parser';
import List from '../utils/List';
import ASTree from '../ast/ASTree';
import ASTList from '../ast/ASTList';
import ASTLeaf from '../ast/ASTLeaf';
import HashSet from '../utils/HashSet';
import HashMap from '../utils/HashMap';
import ArrayList from '../utils/ArrayList';
import ParseException, { useParseException } from '../exceptions/ParseException';

export abstract class Element {
  abstract parse(lexer: Lexer, res: List<ASTree>): void;
  abstract match(lexer: Lexer): boolean;
}

export class Tree extends Element {
  parser: Parser;
  constructor(p: Parser) {
    super();
    this.parser = p;
  }

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    res.add(this.parser.parse(lexer));
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    return this.parser.match(lexer);
  }
}

export class OrTree extends Element {
  parsers: Parser[];
  constructor(p: Parser[]) {
    super();
    this.parsers = p;
  }

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    const p = this.choose(lexer);
    if (p) {
      res.add(p.parse(lexer));
    } else {
      throw new ParseException(lexer.peek(0));
    }
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    return !!this.choose(lexer);
  }

  @useParseException()
  choose(lexer: Lexer): Parser | null {
    for (const p of this.parsers) {
      if (p.match(lexer)) return p;
    }
    return null;
  }

  insert(p: Parser) {
    this.parsers.unshift(p);
  }
}

export class Repeat extends Element {
  parser: Parser;
  onlyOnce: boolean;
  constructor(p: Parser, once: boolean) {
    super();
    this.parser = p;
    this.onlyOnce = once;
  }

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    while (this.parser.match(lexer)) {
      const t = this.parser.parse(lexer);
      if (t.getClass() !== ASTList || t.numChildren() > 0) {
        res.add(t);
      }
      if (this.onlyOnce) break;
    }
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    return this.parser.match(lexer);
  }
}

export abstract class Factory {
  static factoryName = 'create';
  abstract make0(arg: object): ASTree;
  make(arg: object): ASTree {
    try {
      return this.make0(arg);
    } catch (error) {
      throw new Error(error as string);
    }
  }
  static getForASTList<T extends ASTree>(clazz?: T) {
    let f = this.get(clazz);
    if (!f) {
      f = new (class _Factory extends Factory {
        make0(arg: object): ASTree {
          const results = arg as List<ASTree>;
          if (results.size() === 1) return results.get(0);
          return new ASTList(results);
        }
      })();
    }
    return f;
  }

  static get<T extends ASTree, U extends Factory>(clazz?: T): U | null {
    if (!clazz) return null;
    try {
      const m = clazz.getMethod(this.factoryName);
      if (!m) {
        throw new Error('no such method.');
      }
      return new (class _Factory extends Factory {
        make0(arg: object): ASTree {
          return m.call(null, arg);
        }
      })() as unknown as U;
    } catch { }
    try {
      const Ctor = clazz.constructor as ObjectConstructor;
      return new (class _Factory extends Factory {
        make0(arg: object): ASTree {
          return new Ctor(arg) as ASTree;
        }
      })() as unknown as U;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export abstract class AToken<T extends ASTLeaf> extends Element {
  factory: Factory;
  constructor(type?: T) {
    super();
    if (!type) {
      type = ASTLeaf.prototype as T;
    }
    this.factory = Factory.get(type) as Factory;
  }

  abstract test(t: Token): boolean;

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    const t = lexer.read();
    if (this.test(t)) {
      const leaf = this.factory.make(t);
      res.add(leaf);
    } else {
      throw new ParseException(t);
    }
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    return this.test(lexer.peek(0));
  }
}

export class IdToken<T extends ASTLeaf> extends AToken<T> {
  reserved: HashSet<string>;
  constructor(type: T, r: HashSet<string>) {
    super(type);
    this.reserved = r || new HashSet<string>();
  }

  test(t: Token): boolean {
    return t.isIdentifier() && !this.reserved.contains(t.getText());
  }
}

export class NumToken<T extends ASTLeaf> extends AToken<T> {
  constructor(type: T) {
    super(type);
  }
  test(t: Token): boolean { return t.isNumber(); }
}

export class StrToken<T extends ASTLeaf> extends AToken<T> {
  constructor(type: T) {
    super(type);
  }
  test(t: Token): boolean { return t.isString(); }
}

export class Leaf extends Element {
  tokens: string[];
  constructor(pat: string[]) {
    super();
    this.tokens = pat;
  }

  find(res: List<ASTree>, t: Token) {
    res.add(new ASTLeaf(t));
  }

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    const t = lexer.read();
    if (t.isIdentifier()) {
      for (const token of this.tokens) {
        if (token === t.getText()) {
          this.find(res, t);
          return;
        }
      }
    }
    if (this.tokens.length > 0) {
      throw new ParseException(this.tokens[0] + ' expected.', t);
    } else {
      throw new ParseException(t);
    }
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    const t = lexer.peek(0);
    if (t.isIdentifier()) {
      for (const token of this.tokens) {
        if (token === t.getText()) return true;
      }
    }
    return false;
  }
}

export class Skip extends Leaf {
  constructor(t: string[]) {
    super(t);
  }
  find(res: List<ASTree>, t: Token): void { }
}

export class Precedence {
  value: number;
  leftAssoc: boolean;
  constructor(v: number, a: boolean) {
    this.value = v;
    this.leftAssoc = a;
  }
}

export class Operators extends HashMap<string, Precedence> {
  static LEFT = true;
  static RIGHT = false;
  add(name: string, prec: number, leftAssoc: boolean) {
    this.put(name, new Precedence(prec, leftAssoc));
  }
}

export class Expr<T extends ASTree> extends Element {
  factory: Factory;
  ops: Operators;
  factor: Parser;
  constructor(clazz: T, exp: Parser, map: Operators) {
    super();
    this.factory = Factory.getForASTList(clazz);
    this.ops = map;
    this.factor = exp;
  }

  private rightIsExpr(prec: number, nextPrec: Precedence): boolean {
    if (nextPrec.leftAssoc) return prec < nextPrec.value;
    return prec <= nextPrec.value;
  }

  @useParseException()
  private nextOperator(lexer: Lexer): Precedence | null {
    const t = lexer.peek(0);
    if (t.isIdentifier()) return this.ops.get(t.getText());
    return null;
  }

  @useParseException()
  private doShift(lexer: Lexer, left: ASTree, prec: number): ASTree {
    const list = new ArrayList<ASTree>();
    list.add(left);
    list.add(new ASTLeaf(lexer.read()));
    let right = this.factor.parse(lexer);
    let next: Precedence | null;
    while ((next = this.nextOperator(lexer)) != null && this.rightIsExpr(prec, next)) {
      right = this.doShift(lexer, right, next.value);
    }
    list.add(right);
    return this.factory.make(list);
  }

  @useParseException()
  parse(lexer: Lexer, res: List<ASTree>): void {
    let right = this.factor.parse(lexer);
    let prec: Precedence | null;
    while ((prec = this.nextOperator(lexer)) != null) {
      right = this.doShift(lexer, right, prec.value);
    }
    res.add(right);
  }

  @useParseException()
  match(lexer: Lexer): boolean {
    return this.factor.match(lexer);
  }
}