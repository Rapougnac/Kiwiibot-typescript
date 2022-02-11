import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import type KiwiiClient from './Client';
import type { LoggerProps } from './interfaces/Console';
const stdout = fs.createWriteStream(
  path.join(process.cwd(), 'src', 'logs', 'stdout.log')
);
const stderr = fs.createWriteStream(
  path.join(process.cwd(), 'src', 'logs', 'stderr.log')
);

export default class Logger extends Console implements LoggerProps {
  public start: number;
  public stdout: fs.WriteStream = stdout;
  public stderr: fs.WriteStream = stderr;
  public constructor(public readonly client: KiwiiClient) {
    super({
      stdout,
      stderr,
      colorMode: 'auto',
    });
    this.start = Date.now();
  }

  public get console(): Console {
    return console;
  }

  public get timer(): number {
    return Date.now() - this.start;
  }

  public override log(...args: unknown[]): this {
    super.log(
      `[LOG] [${this.timer} ms] [${new Date()}] [${
        this.client.user?.username
      }]:`,
      ...args
    );
    return this;
  }

  public override info(...args: unknown[]): this {
    super.info(
      `[INFO] [${this.timer} ms] [${new Date()}] [${
        this.client.user?.username
      }]:`,
      ...args
    );
    return this;
  }

  public override warn(...args: unknown[]): this {
    super.warn(
      `[WARN] [${this.timer} ms] [${new Date()}] [${
        this.client.user?.username
      }]:`,
      ...args
    );
    return this;
  }

  public override error(...args: unknown[]): this {
    super.error(
      `[ERROR] [${this.timer} ms] [${new Date()}] [${
        this.client.user?.username
      }]:`,
      ...args
    );
    return this;
  }
}
