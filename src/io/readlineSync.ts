import fs from 'fs';

type ReadlineSyncOptions = Partial<{
  readChunk: number;
  linefeed: boolean;
  linefeedCharacter: number;
}>;

export default class ReadlineSync {
  fd: number | null;
  eof!: boolean;
  linesCache!: Buffer[];
  fdPosition!: number;
  options: ReadlineSyncOptions;
  linefeedCharacter: number;
  constructor(file: string | number, options?: ReadlineSyncOptions) {
    options = options || {};
    if (!options.readChunk) options.readChunk = 1024;
    if (!options.linefeed) options.linefeed = true;
    if (!options.linefeedCharacter) {
      options.linefeedCharacter = 0x0a; // linux line ending
    } else {
      options.linefeedCharacter = String(options.linefeedCharacter).charCodeAt(0);
    }

    if (typeof file === 'number') {
      this.fd = file;
    } else {
      this.fd = fs.openSync(file, 'r');
    }

    this.options = options;
    this.linefeedCharacter = options.linefeedCharacter;
    this.reset();
  }

  reset() {
    this.eof = false;
    this.linesCache = [];
    this.fdPosition = 0;
  }

  close() {
    if (typeof this.fd === 'number') {
      fs.closeSync(this.fd);
      this.fd = null;
    }
  }

  private searchInBuffer(buffer: Buffer, hexNeedle: number) {
    let found = -1, b_byte: number;
    for (let i = 0; i <= buffer.length; i += 1) {
      b_byte = buffer[i];
      if (b_byte === hexNeedle) {
        found = i;
        break;
      }
    }
    return found;
  }

  private extractLines(buffer: Buffer) {
    let line: Buffer;
    const lines: Buffer[] = [];
    let bufferPos = 0;

    let lastNewLineBufferPos = 0;
    while (true) {
      let bufferPosValue = buffer[bufferPos++];
      if (bufferPosValue === this.linefeedCharacter) {
        line = buffer.slice(lastNewLineBufferPos, bufferPos);
        lines.push(line);
        lastNewLineBufferPos = bufferPos;
      } else if (bufferPosValue === undefined) {
        break;
      }
    }

    let leftovers = buffer.slice(lastNewLineBufferPos, bufferPos);
    if (leftovers.length) {
      lines.push(leftovers);
    }

    return lines;
  }

  private readChunk(lineLeftovers?: readonly Uint8Array[]) {
    let totalBytesRead = 0;
    let bytesRead: number;
    const buffers: Buffer[] = [];

    do {
      const readBuffer = Buffer.alloc(this.options.readChunk!);
      bytesRead = fs.readSync(this.fd!, readBuffer, 0, this.options.readChunk!, this.fdPosition);
      totalBytesRead += bytesRead;

      this.fdPosition += bytesRead;

      buffers.push(readBuffer);
    } while (bytesRead && this.searchInBuffer(buffers[buffers.length - 1], this.options.linefeedCharacter!) === -1);

    let bufferData = Buffer.concat(buffers);

    if (bytesRead < this.options.readChunk!) {
      this.eof = true;
      bufferData = bufferData.slice(0, totalBytesRead);
    }

    if (totalBytesRead) {
      this.linesCache = this.extractLines(bufferData);
      if (lineLeftovers) {
        this.linesCache[0] = Buffer.concat(lineLeftovers, this.linesCache[0] as unknown as number);
      }
    }

    return totalBytesRead;
  }

  next() {
    if (!this.fd) return false;

    if (this.eof && this.linesCache.length === 0) {
      return false;
    }

    let line: Buffer = Buffer.from('');

    let bytesRead: number;

    if (!this.linesCache.length) {
      bytesRead = this.readChunk();
    }

    if (this.linesCache.length) {
      line = this.linesCache.shift() as Buffer;

      const lastLineCharacter = line[line.length - 1];
      if (lastLineCharacter !== this.linefeedCharacter) {
        bytesRead = this.readChunk(line as unknown as readonly Uint8Array[]);
        if (bytesRead) {
          line = this.linesCache.shift() as Buffer;
        }
      }
    }

    if (this.eof && this.linesCache.length === 0) {
      // line += this.linefeedCharacter;
      this.close();
      if (line[line.length - 1] !== this.linefeedCharacter) {
        line = Buffer.concat([line, Buffer.from('\n')]);
      }
    }
    // remove the linefeed ? 
    if (!this.options.linefeed && line && line[line.length - 1] === this.linefeedCharacter) {
      line = line.slice(0, line.length - 1);
    }

    return line;
  }
}