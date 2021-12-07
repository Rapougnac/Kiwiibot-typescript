/* eslint-disable no-console */
import { Console } from 'console';
import { Transform } from 'stream';

/**
 * Logs on console with color green
 * @param message The message to log on console
 * @param title The string to apply the color to
 */
const success = (message: string, title = 'SUCCESS!'): void =>
    console.log('\x1b[32m', title, '\x1b[0m', message);

/**
 * Logs on console with color yellow
 * @param message The message to log on console
 * @param title The string to apply the color to
 * @returns
 */
const warn = (message: string, title = 'WARN!'): void =>
    console.log('\x1b[33m', title, '\x1b[0m', message);

/**
 * Logs on console with color red
 * @param message The message to log on console
 * @param title The name of the error
 */
const error = (message: string, title = ''): void =>
    console.log(title, '\x1b[31mERR!\x1b[0m', message);

/**
 * Logs on console table without the index of the array/object\
 * Try to construct a table with the columns of the properties of `tabularData`(or use `properties`) and rows of `tabularData` and log it. Falls back to just
 * logging the argument if it can’t be parsed as tabular.
 * @param tabularData The data to log on console
 *
 * ```js
 * // These can't be parsed as tabular data
 * console.table(Symbol());
 * // Symbol()
 *
 * console.table(undefined);
 * // undefined
 *
 * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
 * // ┌─────┬─────┐
 * // │  a  │  b  │
 * // ├─────┼─────┤
 * // │  1  │  Y  │
 * // │  Z  │  2  │
 * // └─────┴─────┘
 *
 *
 * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
 * // ┌─────┐
 * // │  a  │
 * // ├─────┤
 * // │  1  │
 * // │  Z  │
 * // └─────┘
 * ```
 * @param properties Alternate properties for constructing the table.
 */
const table = (
    tabularData: unknown[],
    properties?: ReadonlyArray<string>
): void => {
    const ts = new Transform({
        transform(chunk, _, cb) {
            cb(null, chunk);
        },
    });
    const logger = new Console({ stdout: ts, stderr: ts });
    logger.table(tabularData, properties);
    const _table = ts.read().toString();
    let result = '';
    for (const row of _table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');

        result += `${r}\n`;
    }

    console.log(result);
};

export { success, warn, error, table };
