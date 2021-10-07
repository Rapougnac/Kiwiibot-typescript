/**
 * Logs on console with color green
 * @param message The message to log on console
 * @param title The string to apply the color to
 */
const success = (message: string, title: string = 'SUCCESS!'): void =>
    console.log('\x1b[32m', title, '\x1b[0m', message);

/**
 * Logs on console with color yellow
 * @param message The message to log on console
 * @param title The string to apply the color to
 * @returns
 */
const warn = (message: string, title: string = 'WARN!'): void =>
    console.log('\x1b[33m', title, '\x1b[0m', message);

/**
 * Logs on console with color red
 * @param message The message to log on console
 * @param title The name of the error
 */
const error = (message: string, title: string = ''): void =>
    console.log(title, '\x1b[31mERR!\x1b[0m', message);

export { success, warn, error };
