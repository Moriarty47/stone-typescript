import path from 'path';
import ReadlineSync from './readlineSync';

const root = process.cwd();

export default class Reader {
  reader: ReadlineSync;
  lineNumber: number;
  filepath: string;
  constructor(file: string) {
    this.filepath = path.resolve(root, file);
    this.reader = new ReadlineSync(this.filepath);
    this.lineNumber = 0;
  }

  readLine() {
    const line = this.reader.next();
    if (line) {
      this.lineNumber++;
      return line.toString('utf-8');
    }
    return false;
  }

  getLineNumber() {
    return this.lineNumber;
  }
};
