import { md5 } from 'js-md5';
import NestedEnv from './NestedEnv';
import Environment from './Environment';
import BlockStmnt from '../ast/BlockStmnt';
import ParameterList from '../ast/ParameterList';

export default class Function {
  protected _parameters: ParameterList;
  protected _body: BlockStmnt;
  protected _env: Environment;
  constructor(p: ParameterList, b: BlockStmnt, e: Environment) {
    this._parameters = p;
    this._body = b;
    this._env = e;
  }

  public parameters(): ParameterList { return this._parameters; }

  public body(): BlockStmnt { return this._body; }

  public makeEnv(): Environment { return new NestedEnv(this._env); }

  public toString(): string {
    return `<fun:${md5(this._parameters.toString())}>`;
  }
};