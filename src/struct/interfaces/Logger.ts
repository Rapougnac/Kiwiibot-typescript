import type KiwiiClient from '../Client';
import type { WriteStream } from 'fs';

/**
 * The Logger interface. This interface is used to log messages to the passed streams.
 * Default to a file stream.
 */
export interface LoggerProps {
  /**
   * The client instance
   */
  client: KiwiiClient;

  /**
   * The start time
   */
  start: number;

  /**
   * The stdout stream
   */
  stdout: WriteStream;

  /**
   * The stderr stream
   */
  stderr: WriteStream;

  /**
   * The console instance
   */
  console: typeof console;
}
