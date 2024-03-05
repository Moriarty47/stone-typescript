export default interface Environment {
  put(name: string, value: object): void;
  get(name: string): object;
};