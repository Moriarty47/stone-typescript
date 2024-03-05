import Environment from './Environment';

export default class FuncEvaluator {

};

export interface Env extends Environment {
  putNew(name: string, value: object): void;
  where(name: string): Environment;
  setOuter(e: Environment): void;
};