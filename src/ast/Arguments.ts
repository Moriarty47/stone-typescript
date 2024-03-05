import ASTree from './ASTree';
import Postfix from './Postfix';
import List from '../utils/List';
import Function from '../environment/Function';
import Environment from '../environment/Environment';
import StoneException from '../exceptions/StoneException';

export default class Arguments extends Postfix {
  constructor(list: List<ASTree>) {
    super(list);
  }

  public size(): number { return this.numChildren(); }

  public eval(callerEnv: Environment, value: object): object {
    if (!(value instanceof Function)) {
      throw new StoneException('bad function', this);
    }
    const func = value as Function;
    const params = func.parameters();
    if (this.size() !== params.size()) {
      throw new StoneException('bad number of arguments', this);
    }
    const newEnv = func.makeEnv();
    let num = 0;
    for (const t of this) {
      params.eval(newEnv, num++, t.eval(callerEnv));
    }
    return func.body().eval(newEnv) as object;
  }
};