import test from 'ava';
import Token from '../Token';
import Lexer from '../Lexer';
import Reader from '../io/Reader';
import NullStmnt from '../ast/NullStmnt';

import FuncParser from '../pasers/FuncParser';
import BasicParser from '../pasers/BasicParser';
import ClosureParser from '../pasers/ClosureParser';

import BasicEnv from '../environment/BasicEnv';
import NestedEnv from '../environment/NestedEnv';

const getLexer = (index: number) => new Lexer(new Reader(`./src/test/${index}.stone`));
// const lexer = new Lexer(new Reader('./src/test/1.stone'));
// lexer.fillQueue(100);
// console.log('lexer.printAll() :>>', lexer.printAll());

function parserRunner(i = 1) {
  const lexer = getLexer(i);
  const bp = new BasicParser();
  const res: string[] = [];
  while (lexer.peek(0) !== Token.EOF) {
    const ast = bp.parse(lexer);
    res.push(ast.toString());
  }
  return res;
}
test('parser runner test', t => {
  t.deepEqual(parserRunner(), [
    '(even = 0)',
    '(odd = 0)',
    '(i = 1)',
    '1',
    '(str = 我是字符串)',
    '(while (i < 10) ((if ((i % 2) == 0) ((even = (even + i))) else ((odd = (odd + i)))) (i = (i + 1))))',
    '(even + odd)',
  ]);
});

function basicParserRunner(i = 2) {
  const lexer = getLexer(i);
  const bp = new BasicParser();
  const env = new BasicEnv();
  const res: string[] = [];
  while (lexer.peek(0) !== Token.EOF) {
    const ast = bp.parse(lexer);
    if (!(ast instanceof NullStmnt)) {
      const ret = ast.eval(env);
      res.push(`${ast.toString()} :>> ${ret}`);
    }
  }
  return res;
}
test('basic parser runner test', t => {
  t.deepEqual(basicParserRunner(), [
    '(sum = 0) :>> 0',
    '(i = 1) :>> 1',
    '(j = -2) :>> -2',
    '(while (i < 10) ((sum = (sum + i)) (i = (i + 1)))) :>> 10',
    'sum :>> 45'
  ]);
});

function funcParserRunner(i = 3) {
  const lexer = getLexer(i);
  const bp = new FuncParser();
  const env = new NestedEnv();
  const res: string[] = [];
  while (lexer.peek(0) !== Token.EOF) {
    const ast = bp.parse(lexer);
    if (!(ast instanceof NullStmnt)) {
      const ret = ast.eval(env);
      res.push(`${ast.toString()} :>> ${ret}`);
    }
  }
  return res;
}
// funcParserRunner();
test('function parser runner test', t => {
  t.deepEqual(funcParserRunner(), [
    '(def fib (n) ((if (n < 2) (n) else (((fib ((n - 1))) + (fib ((n - 2)))))))) :>> fib',
    '(fib (10)) :>> 55',
  ]);
});

function closureParserRunner(i = 4) {
  const lexer = getLexer(i);
  const bp = new ClosureParser();
  const env = new NestedEnv();
  const res: string[] = [];
  while (lexer.peek(0) !== Token.EOF) {
    const ast = bp.parse(lexer);
    if (!(ast instanceof NullStmnt)) {
      const ret = ast.eval(env);
      console.log('ast :>>', ast);
      // const primaryExpr = ast.child(2);
      // console.log('primaryExpr.child(0) :>>', primaryExpr.child(0));
      res.push(`${ast.toString()} :>> ${ret}`);
    }
  }
  return res;
}
// closureParserRunner();
// test('closure parser runner test', t => {
//   t.deepEqual(closureParserRunner(), [
//     '(def counter (c) ((fun () ()))) :>> counter',
//     '(c1 = (counter (0))) :>> ',
//     '(c2 = (counter (0))) :>> ',
//     '(c1 :>> ',
//     '(c1 :>> ',
//     '(c2 :>> '
//   ]);
// });
