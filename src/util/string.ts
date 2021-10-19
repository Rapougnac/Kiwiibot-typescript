import { UserFlags } from 'discord.js';
/**
 * TextTruncate -> Shortens the string to desired length
 * @param str the string to test with
 * @param length the length the string should have
 * @param end the end of the string indicating it's truncated
 * @returns Truncated string
 */
function textTruncate(
    str: string = '',
    length: number = 100,
    end: string = '...'
): string {
    return (
        String(str).substring(0, length - end.length) +
        (str.length > length ? end : '')
    );
}

/**
 * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
 * @param n the Number to append ordinal suffix to
 * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
 * @returns Ordinalized number
 * @note Does not support negative numbers!
 */
function ordinalize(n: number = 0): string {
    return (
        Number(n) + ['st', 'nd', 'rd'][(n / 10) % 10 ^ 1 && n % 10] ||
        Number(n) + 'th'
    );
}

/**
 *
 * @param number The number to separte
 * @param sep The separator of the numbers
 * @example separateNumbers(123456); // will return `123'456`;
 * separateNumbers(1234.567); // will return `1'234.567`;
 * @returns The numbers with quotation marks
 */
function separateNumbers(number: number | string, sep: string = "'"): string {
    return Number(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/**
 * Joins array via oxford comma and append 'and' on last 2 items
 * @param array the array to join
 * @returns the joined array
 */
function joinArray(array: any[] = [], lang = 'en-US'): string {
    let list = new Intl.ListFormat(lang);
    return list.format(array.map((x) => String(x)));
}
/**
 * Join array and add a limiter.
 * @param array the array to join
 * @param limit the maximum length of the string output
 * @param connector similar to param of `array.join()`
 * @example joinArrayAndLimit([1,2,3,4,5,6,7,8,9,10,11], 5);
 * //will return  text: '1, 2, 3, 4, 5', excess: 6
 * @returns The joined array
 */
function joinArrayAndLimit(
    array: any[] | any = [],
    limit: number | string = 1000,
    connector: string = ', '
): { text: string; excess: number } {
    if (!Array.isArray(array))
        throw new TypeError(
            `An array was exepcted, recevied "${typeof array}"`
        );
    limit = Number(limit);
    if (isNaN(limit)) throw new Error(`${limit} is not a number.`);
    if (array.length > limit) {
        const excess = array.length - limit;
        array = array.splice(0, limit);
        const text = array.join(connector);
        array = { text: text, excess: excess };
    } else {
        array = { text: array.join(connector), excess: 0 };
    }
    return array;
}

/**
 * cleans text from unnecessary character
 * @param text The string to clean
 * @returns the cleaned string
 */
function clean(text: string): string {
    return String(text)
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);
}
/**
 * Convert flags bitfield to string in array
 * @param bitfield The bitfield to pass in
 * @returns  The array of the user flags
 */
function convertUFB(bitfield: number): string[] {
    if (!bitfield) throw 'Missing Bitfield';
    if (isNaN(bitfield)) throw new TypeError(`${bitfield} is not a number`);
    let processConvert = bitfield;
    let UFConvertResult: string[] = [];
    const ACFlags = Object.entries(UserFlags.FLAGS).sort(function (a, b) {
        return Number(b[1]) - Number(a[1]);
    });
    ACFlags.forEach((flag) => {
        if (processConvert - flag[1] >= 0) {
            UFConvertResult.push(flag[0]);
            processConvert = processConvert - flag[1];
        }
    });
    return UFConvertResult;
}

type TrimArrayOptions = {
    /**
     * The lenght of the array
     */
    maxLength?: number;
    /**
     * The end of the array
     */
    end?: string;
};

/**
 * Trim an array
 * @param {*[]} array The array to pass in.
 * @param {TrimArrayOptions} options
 * @returns {*[]} The trimmed array.
 */
function trimArray(
    array: any[],
    { maxLength = 10, end = 'And {length} more...' }: TrimArrayOptions
): any[] {
    if (!Array.isArray(array))
        throw new TypeError(
            `An array was expected, received "${typeof array}"`
        );
    if (array.length > maxLength) {
        const length = array.length - maxLength;
        array = array.splice(0, maxLength);
        array.push(
            end.match(/{length}/g)
                ? end.replace(/{length}/g, length.toString())
                : end
        );
    }
    return array;
}

/**
 * Convert a string to proper case
 * @param s The string to proper
 * @returns The proper string
 * @example 
 * const myString = 'hello world';
 * const newString = toProperCase(myString);
 * console.log(newString); // Hello World
 */
function toProperCase(s: string): string {
    return s.replace(/([^\W_]+[^\s-]*)/g, (str: string) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
}

function remove(array: string[], ..._args: any): string[] {
    let what,
        a = arguments,
        L = a.length,
        ax;
    while (L && array.length) {
        what = a[--L];
        while ((ax = array.indexOf(what)) !== -1) {
            array.splice(ax, 1);
        }
    }
    return array;
}

export {
    textTruncate,
    ordinalize,
    separateNumbers,
    joinArray,
    joinArrayAndLimit,
    clean,
    convertUFB,
    trimArray,
    toProperCase,
    remove
};
