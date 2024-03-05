import StoneException from './exceptions/StoneException';

export class Token {
  static EOF = new Token(-1);
  static EOL = '\n';
  lineNumber: number;
  constructor(line: number) {
    this.lineNumber = line;
  }
  getLineNumber(): number { return this.lineNumber; }
  isIdentifier(): boolean { return false; }
  isNumber(): boolean { return false; }
  isString(): boolean { return false; }
  getNumber(): number { throw new StoneException('not number token'); }
  getText(): string { return ''; }
};

export class NumToken extends Token {
  value: number | undefined;
  constructor(line: number, v?: number) {
    super(line);
    this.value = v;
  }
  isNumber(): boolean { return true; }
  getText(): string { return this.value!.toString(); }
  getNumber(): number { return this.value!; }
}

export class IdToken extends Token {
  text: string | undefined;
  constructor(line: number, id?: string) {
    super(line);
    this.text = id;
  }
  isIdentifier(): boolean { return true; }
  getText(): string { return this.text!; }
}

export class StrToken extends Token {
  literal: string | undefined;
  constructor(line: number, str?: string) {
    super(line);
    this.literal = str;
  }
  isString(): boolean { return true; }
  getText(): string { return this.literal!; }
}

export default Token;