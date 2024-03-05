import Token from '../Token';

export default class ParseException extends Error {
  static location(t: Token) {
    if (t === Token.EOF) return 'the last line';
    return "\"" + t.getText() + "\" at line " + t.getLineNumber();
  }
  constructor(...args: [Token] | [Error] | [string] | [string, Token]) {
    const [args0, args1] = args;
    if (typeof args0 === 'string') {
      if (typeof args1 === 'undefined') {
        super(args0);
      } else {
        super("syntax error around " + ParseException.location(args1) + ". " + args0);
      }
    } else {
      if (args0 instanceof Token) {
        super("syntax error around " + ParseException.location(args0) + ". ");
      } else {
        super(args0.message);
        this.stack = args0.stack;
        this.name = args0.name;
      }
    }
  }
};

export function useParseException(): MethodDecorator {
  return function (target, propKey, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...rest: any[]) {
      try {
        return originalMethod.apply(this, rest);
      } catch (error) {
        throw new ParseException(error as string);
      }
    };
  };
};