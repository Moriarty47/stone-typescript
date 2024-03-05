import Reader from './io/Reader';
import ArrayList from './utils/ArrayList';
import Token, { IdToken, NumToken, StrToken } from './Token';
import ParseException, { useParseException } from './exceptions/ParseException';

export default class Lexer {
  static RegexPatternStr = '\\s*'
    + '(?<comment>\\/\\*.*?\\*\\/|\\/\\/.*)' + '|'
    + '(?<integer>\\d+.\\d+|\\d+)' + '|'
    + '(?<string>\\"(\\"|\\\\|\\n|[^"])*\\")' + '|'
    + '(?<identifier>[A-Za-z_]\\w*|==|<=|>=|&&|\\|\\||\\S)' + '|'
    + '(\\n)'
    + '\\s*';
  private queue: ArrayList<Token> = new ArrayList<Token>();
  private hasMore: boolean;
  private reader: Reader;

  constructor(r: Reader) {
    this.hasMore = true;
    this.reader = r;
  }

  @useParseException()
  fillQueue(i: number) {
    while (i >= this.queue.size()) {
      if (this.hasMore) {
        this.readLine();
      } else {
        return false;
      }
    }
    return true;
  }

  printAll() {
    return this.queue;
  }

  @useParseException()
  read() {
    if (this.fillQueue(0)) {
      return this.queue.remove(0);
    } else {
      return Token.EOF;
    }
  }

  @useParseException()
  peek(i: number) {
    if (this.fillQueue(i)) return this.queue.get(i);
    return Token.EOF;
  }

  @useParseException()
  readLine() {
    let line: string | false;
    try {
      line = this.reader.readLine();
    } catch (error) {
      throw new ParseException(error as Error);
    }
    if (line === false) {
      this.hasMore = false;
      return;
    }
    const lineNo = this.reader.getLineNumber();
    const pattern = new RegExp(Lexer.RegexPatternStr, 'g');
    let result: RegExpExecArray | null;
    while ((result = pattern.exec(line)) !== null) {
      if (!result[1]) { // not a comment
        if (result[2]) {
          this.queue.add(new NumToken(lineNo, result[2].includes('.')
            ? Number.parseFloat(result[2])
            : Number.parseInt(result[2])
          ));
        } else if (result[3]) {
          this.queue.add(new StrToken(lineNo, this.toStringLiteral(result[3])));
        } else if (result[5]) {
          this.queue.add(new IdToken(lineNo, result[5]));
        } else if (result[6]) { // line feed
          this.queue.add(new IdToken(lineNo, result[6]));
        }
      }
    }
  }

  toStringLiteral(str: string): string {
    let nstr = '';
    for (let i = 1, len = str.length - 1; i < len; i += 1) {
      let c = str.charAt(i);
      if (c === '\\' && i + 1 < len) {
        let c2 = str.charAt(i + 1);
        if (c2 === '"' || c2 === '\\') {
          c = str.charAt(++i);
        } else if (c2 === 'n') {
          ++i;
          c = '\n';
        }
      }
      nstr += c;
    }
    return nstr;
  }
};
