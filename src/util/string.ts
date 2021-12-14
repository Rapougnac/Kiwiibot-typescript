/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    UserFlags,
    PermissionString,
    GuildMember,
    User,
    ImageURLOptions,
} from 'discord.js';

/* Thanks to maisans-maid on the [Mai Repo](https://github.com/maisans-maid/Mai) for theses functions */

// MIT License
//
// Copyright (c) 2020-2021 Sakurajimai#6742
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * TextTruncate -> Shortens the string to desired length
 * @param str the string to test with
 * @param length the length the string should have
 * @param end the end of the string indicating it's truncated
 * @returns Truncated string
 */
function textTruncate(str = '', length = 100, end = '...'): string {
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
function ordinalize(n = 0): string {
    return (
        `${Number(n)} ${
            ['st', 'nd', 'rd'][(n / 10) % 10 ^ 1 && n % 10] ?? 'th'
        }` || `${Number(n)}th`
    );
}

/**
 * Joins array via oxford comma and append 'and' on last 2 items
 * @param array the array to join
 * @returns the joined array
 */
function joinArray(array: string[] = [], lang = 'en-US'): string {
    const list = new Intl.ListFormat(lang);
    return list.format(array.map((x) => String(x)));
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

/* ------------------------------------------------------------------------------------------------------------- */

/**
 * Separate a number by a delimiter
 * @default ','
 * @param number The number to separte
 * @param sep The separator of the numbers
 * @example separateNumbers(123456); // will return `123'456`;
 * separateNumbers(1234.567); // will return `1'234.567`;
 * @returns The numbers with quotation marks
 */
function separateNumbers(
    number: number | string,
    locale = 'en',
    sep = ','
): string {
    if (locale === 'fr') sep = "'";
    return Number(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
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
    array = [],
    limit: number | string = 1000,
    connector = ', '
): { text: string; excess: number } {
    if (!Array.isArray(array))
        throw new TypeError(
            `An array was exepcted, recevied "${typeof array}"`
        );
    limit = Number(limit);
    if (Number.isNaN(limit)) throw new Error(`${limit} is not a number.`);
    if (array.length > limit) {
        const excess = array.length - limit;
        array = array.splice(0, limit);
        const text = array.join(connector);
        const value = { text, excess };
        return value;
    } else {
        const value = { text: array.join(connector), excess: 0 };
        return value;
    }
}

/**
 * Convert flags bitfield to string in array
 * @param bitfield The bitfield to pass in
 * @returns  The array of the user flags
 *
 * Thanks to [Tsumiki](https://github.com/TsumikiVR) for this function :D
 */
function convertUFB(bitfield: number): string[] {
    if (!bitfield) throw 'Missing Bitfield';
    if (Number.isNaN(bitfield))
        throw new TypeError(`${bitfield} is not a number`);
    let processConvert = bitfield;
    const UFConvertResult: string[] = [];
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
    array: string[],
    { maxLength = 10, end = 'And {length} more...' }: TrimArrayOptions
): string[] {
    if (!Array.isArray(array))
        throw new TypeError(
            `An array was expected, received "${typeof array}"`
        );
    if (array.length > maxLength) {
        const length = array.length - maxLength;
        array = array.splice(0, maxLength);
        array.push(
            /{length}/g.test(end)
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
    return s.replace(
        /([^\W_]+[^\s-]*)/g,
        (str: string) =>
            str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    );
}

function remove(array: string[], ...args: string[]): string[] {
    let what,
        L = args.length,
        ax;
    while (L && array.length) {
        what = args[--L];
        while ((ax = array.indexOf(what ?? '0')) !== -1) {
            array.splice(ax, 1);
        }
    }
    return array;
}
/**
 * Translate permissions in the specified locale
 * @param permissions The permissions to translate
 * @param locale The locale to translate to
 */
function translatePermissions(
    permissions: PermissionString[],
    locale: 'en' | 'fr' | string = 'en'
): PermissionString[] | string[] {
    switch (locale) {
        case 'en': {
            return permissions;
        }
        case 'fr': {
            const _: string[] = [];
            for (const permission of permissions) {
                switch (permission) {
                    case 'ADD_REACTIONS': {
                        _.push('AJOUTER_DES_RÉACTONS');
                        break;
                    }
                    case 'ADMINISTRATOR': {
                        _.push('ADMINISTRATEUR');
                        break;
                    }
                    case 'ATTACH_FILES': {
                        _.push('JOINDRE_DES_FICHIERS');
                        break;
                    }
                    case 'BAN_MEMBERS': {
                        _.push('BANNIR_DES_MEMBRES');
                        break;
                    }
                    case 'CHANGE_NICKNAME': {
                        _.push('CHANGER_DE_PSEUDO');
                        break;
                    }
                    case 'CONNECT': {
                        _.push('SE_CONNECTER');
                        break;
                    }
                    case 'CREATE_INSTANT_INVITE': {
                        _.push('CRÉER_DES_INVITATIONS');
                        break;
                    }
                    case 'CREATE_PRIVATE_THREADS': {
                        _.push('CRÉER_DES_FILS_PRIVÉS');
                        break;
                    }
                    case 'CREATE_PUBLIC_THREADS': {
                        _.push('CRÉER_DES_FILS_PUBLICS');
                        break;
                    }
                    case 'DEAFEN_MEMBERS': {
                        _.push('METTRE_EN_SOURDINE_DES_MEMBRES');
                        break;
                    }
                    case 'EMBED_LINKS': {
                        _.push('INTÉGRER_DES_LIENS');
                        break;
                    }
                    case 'KICK_MEMBERS': {
                        _.push('EXPULSER_DES_MEMBRES');
                        break;
                    }
                    case 'MANAGE_CHANNELS': {
                        _.push('GÉRER_LES_SALONS');
                        break;
                    }
                    case 'MANAGE_EMOJIS_AND_STICKERS': {
                        _.push('GÉRER_LES_ÉMOJIS_ET_LES_STICKERS');
                        break;
                    }
                    case 'MANAGE_GUILD': {
                        _.push('GÉRER_LE_SERVEUR');
                        break;
                    }
                    case 'MANAGE_MESSAGES': {
                        _.push('GÉRER_LES_MESSAGES');
                        break;
                    }
                    case 'MANAGE_NICKNAMES': {
                        _.push('GÉRER_LES_PSEUDOS');
                        break;
                    }
                    case 'MANAGE_ROLES': {
                        _.push('GÉRER_LES_RÔLES');
                        break;
                    }
                    case 'MANAGE_THREADS': {
                        _.push('GÉRER_DES_FILS');
                        break;
                    }
                    case 'MANAGE_WEBHOOKS': {
                        _.push('GÉRER_LES_WEBHOOKS');
                        break;
                    }
                    case 'MENTION_EVERYONE': {
                        _.push('MENTIONNER_EVERYONE');
                        break;
                    }
                    case 'MOVE_MEMBERS': {
                        _.push('DÉPLACER_DES_MEMBRES');
                        break;
                    }
                    case 'MUTE_MEMBERS': {
                        _.push('RENDRE_LES_MEMBRES_MUETS');
                        break;
                    }
                    case 'PRIORITY_SPEAKER': {
                        _.push('INTERLOCUTEUR_PRIORITAIRE');
                        break;
                    }
                    case 'READ_MESSAGE_HISTORY': {
                        _.push("LIRE_L'HISTORIQUE_DES_MESSAGES");
                        break;
                    }
                    case 'SEND_MESSAGES': {
                        _.push('ENVOYER_DES_MESSAGES');
                        break;
                    }
                    case 'SEND_MESSAGES_IN_THREADS': {
                        _.push('ENVOYER_DES_MESSAGES_DANS_DES_FILS');
                        break;
                    }
                    case 'SEND_TTS_MESSAGES': {
                        _.push('ENVOYER_DES_MESSAGES_DE_SYTHÈSE_VOCALE');
                        break;
                    }
                    case 'SPEAK': {
                        _.push('PARLER');
                        break;
                    }
                    case 'STREAM': {
                        _.push('VIDÉO');
                        break;
                    }
                    case 'START_EMBEDDED_ACTIVITIES': {
                        _.push('DÉBUTER_DES_ACTIVITÉS_INTÉGRÉES');
                        break;
                    }
                    case 'USE_APPLICATION_COMMANDS': {
                        _.push("UTILISER_DES_COMMANDES_D'APPLICATION");
                        break;
                    }
                    case 'USE_EXTERNAL_EMOJIS': {
                        _.push('UTILISER_DES_ÉMOJIS_EXTERNES');
                        break;
                    }
                    case 'USE_EXTERNAL_STICKERS': {
                        _.push('UTILISER_DES_STICKERS_EXTERNES');
                        break;
                    }
                    case 'USE_PRIVATE_THREADS': {
                        _.push('UTILISER_DES_FILS_PRIVÉS');
                        break;
                    }
                    case 'USE_PUBLIC_THREADS': {
                        _.push('UTILISER_DES_FILS_PUBLICS');
                        break;
                    }
                    case 'USE_VAD': {
                        _.push('UTILISER_LA_DÉTECTION_DE_VOIX');
                        break;
                    }
                    case 'VIEW_AUDIT_LOG': {
                        _.push('ACCÉDER_AUX_LOGS');
                        break;
                    }
                    case 'VIEW_CHANNEL': {
                        _.push('VOIR_LE_SALON');
                        break;
                    }
                    case 'VIEW_GUILD_INSIGHTS': {
                        _.push('VOIR_UN_APERÇU_DU_SERVEUR');
                        break;
                    }
                }
            }
            return _;
        }
        case 'de': {
            const _: string[] = [];
            for (const permission of permissions) {
                switch (permission) {
                    case 'ADD_REACTIONS': {
                        _.push('REAKTIONEN_HINZUFÜGEN');
                        break;
                    }
                    case 'ADMINISTRATOR': {
                        _.push('VERWALTER');
                        break;
                    }
                    case 'ATTACH_FILES': {
                        _.push('DATEIEN_ANFÜGEN');
                        break;
                    }
                    case 'BAN_MEMBERS': {
                        _.push('MITGLIEDER_VERBIETEN');
                        break;
                    }
                    case 'CHANGE_NICKNAME': {
                        _.push('SPITZNAMEN_ÄNDERN');
                        break;
                    }
                    case 'CONNECT': {
                        _.push('VERBINDEN');
                        break;
                    }
                    case 'CREATE_INSTANT_INVITE': {
                        _.push('INSTANTANÜTIGE_INVITATION_ERSTELLEN');
                        break;
                    }
                    case 'DEAFEN_MEMBERS': {
                        _.push('MITGLEIDER_BETÄUBEN');
                        break;
                    }
                    case 'EMBED_LINKS': {
                        _.push('LINKS_EINBINDEN');
                        break;
                    }
                    case 'KICK_MEMBERS': {
                        _.push('MITGLEIDER_KICKEN');
                        break;
                    }
                    case 'MANAGE_CHANNELS': {
                        _.push('KANÄLE_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_EMOJIS_AND_STICKERS': {
                        _.push('EMOJIS_UND_STICKERS_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_GUILD': {
                        _.push('SERVER_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_MESSAGES': {
                        _.push('NACHRICHTEN_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_NICKNAMES': {
                        _.push('NICKNAMEN_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_ROLES': {
                        _.push('ROLLE_VERWALTEN');
                        break;
                    }
                    case 'MANAGE_WEBHOOKS': {
                        _.push('WEBHOOKS_VERWALTEN');
                        break;
                    }
                    case 'MENTION_EVERYONE': {
                        _.push('JEDEINEN_ERMÄNLEN');
                        break;
                    }
                    case 'MOVE_MEMBERS': {
                        _.push('MITGLEIDER_BEWEGEN');
                        break;
                    }
                    case 'MUTE_MEMBERS': {
                        _.push('MITGLEIDER_STUMMSCHALTEN');
                        break;
                    }
                    case 'PRIORITY_SPEAKER': {
                        _.push('PRIORITÄTSPEAKER');
                        break;
                    }
                    case 'READ_MESSAGE_HISTORY': {
                        _.push('NACHRICHTENVERLAUF_LESEN');
                        break;
                    }
                    case 'SEND_MESSAGES': {
                        _.push('NACHRICHTEN_SENDEN');
                        break;
                    }
                    case 'SEND_TTS_MESSAGES': {
                        _.push('NACHRICHTEN_SENDEN_(TTS)');
                        break;
                    }
                    case 'SPEAK': {
                        _.push('SPRECHEN');
                        break;
                    }
                    case 'STREAM': {
                        _.push('STREAM');
                        break;
                    }
                    case 'USE_EXTERNAL_EMOJIS': {
                        _.push('EXTERNAL_EMOJIS_VERWENDEN');
                        break;
                    }
                    case 'USE_VAD': {
                        _.push('SPRACHAKTIVITÄTSERKENNUNG_VERWENDEN');
                        break;
                    }
                    case 'VIEW_AUDIT_LOG': {
                        _.push('AUDIT_LOG_ANZEIGEN');
                        break;
                    }
                    case 'VIEW_CHANNEL': {
                        _.push('KANAL_ANZEIGEN');
                        break;
                    }
                    case 'VIEW_GUILD_INSIGHTS': {
                        _.push('SERVER_ANZEIGEN');
                        break;
                    }
                }
            }
            return _;
        }
        default: {
            return permissions;
        }
    }
    return permissions;
}
/**
 * Set an upper case on the first letter
 * @param str The string to apply the function
 */
function upperFirstButAcceptEmojis(str: string): string {
    if (str.length === 0) throw new Error('String is empty');
    const reg =
        // eslint-disable-next-line no-misleading-character-class
        /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}\u{200d}\u{2139}] /gu;

    const emoji = reg.exec(str);
    if (!emoji && str[0]) {
        str = str[0].toUpperCase() + str.slice(1);
    } else if (emoji?.[0] && str[0]) {
        str = str.slice(emoji[0].length);
        str = `${str[0]?.toUpperCase() ?? ''}${str.slice(1)}`;
        str = emoji[0] + str;
    }
    return str;
}

function testCombinaisonsOfWord(input: string): string[] {
    const letters: string[] = input.split('');
    const permCount: number = 1 << input.length;
    const results: string[] = [];

    for (let perm = 0; perm < permCount; perm++) {
        letters.reduce((perm, letter, i) => {
            letters[i] = perm & 1 ? letter.toUpperCase() : letter.toLowerCase();
            return perm >> 1;
        }, perm);
        const result = letters.join('');
        results.push(result);
    }
    return results;
}

// Function that parse a datelike "Oct 6, 2021" into a valid date format like "2021-10-06"
function parseDate(date: string, reverse?: boolean): string {
    if (date.length === 0) throw 'Not A valid datelike';
    const [month, day, year] = date.replace(/,/g, '').split(' ').slice(0, 3);

    type Months =
        | 'Jan'
        | 'Feb'
        | 'Mar'
        | 'Apr'
        | 'May'
        | 'Jun'
        | 'Jul'
        | 'Aug'
        | 'Sep'
        | 'Oct'
        | 'Nov'
        | 'Dec';

    const months = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
    };

    const fullDate = `${year ?? '1900'}-${months[month as Months] ?? '01'}-${
        day ?? '01'
    }`;

    const toSplit = fullDate.split('-');
    const reversed = toSplit.reverse();
    const joined = reversed.join('-');

    return reverse ? joined : fullDate;
}

function beautifyCategories(category: string, nsfw = true): string {
    let categoriesString = '';

    switch (category) {
        case 'auto': {
            categoriesString = '🤖 auto';
            break;
        }
        case 'anime': {
            categoriesString = '🎥 anime';
            break;
        }
        case 'core': {
            categoriesString = '⚙ Core';
            break;
        }
        case 'docs': {
            categoriesString = '📖 docs';
            break;
        }
        case 'image-manipulation': {
            categoriesString = '🖼 image-manipulation';
            break;
        }
        case 'edit-images': {
            categoriesString = '✏ edit-images';
            break;
        }
        case 'infos': {
            categoriesString = 'ℹ infos';
            break;
        }
        case 'interactions': {
            categoriesString = '👋 interactions';
            break;
        }
        case 'owner': {
            categoriesString = '⛔ owner';
            break;
        }
        case 'nsfw': {
            if (nsfw) categoriesString = '🔞 nsfw';
            break;
        }
        case 'misc': {
            categoriesString = '🔧 misc';
            break;
        }
        default: {
            categoriesString = category;
        }
    }
    return categoriesString.replace(/-/g, ' ');
}

/**
 * Function that count words
 * @param str The string to count the words to.
 * @returns An object with the key as the word and the value as the number of times it appears.
 */
function countWords(str: string): { [key: string]: number } {
    const words = str.split(/\s+/);
    const counts: { [key: string]: number } = {};
    words.forEach((word) => {
        counts[word] = (counts[word] || 0) + 1;
    });
    return counts;
}

/**
 * Check if object is empty or not. An object is considered empty if it doesn't have any enumerable properties.\
 * This is the same as `Object.keys(obj).length === 0`.
 * @param o The object to check
 * @returns True if the object is empty, false otherwise
 */
function isEmpty(o: object): boolean {
    return (
        o &&
        Object.keys(o).length === 0 &&
        Object.getPrototypeOf(o) === Object.prototype
    );
}

function displayAvatarURL(
    user: GuildMember | User,
    options: ImageURLOptions
): string {
    if (user instanceof GuildMember) {
        return user.user.displayAvatarURL(options);
    }
    return user.displayAvatarURL(options);
}

function safeEval(code: string): string {
    // All the ts-ignore, because first I don't know how to type this properly, and second, "this" is typed as any.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('global', 'process', `return ${code}`);
    (function () {
        // @ts-ignore
        if (!this) return void 0;
        //@ts-ignore
        const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
        keys.forEach((key) => {
            //@ts-ignore
            const item = this[key];
            if (!item || typeof item !== 'function') return;
            //@ts-ignore
            this[key].constructor = undefined;
        });
    })();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return fn.bind(Function)(code);
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
    remove,
    translatePermissions,
    upperFirstButAcceptEmojis,
    testCombinaisonsOfWord,
    parseDate,
    beautifyCategories,
    countWords,
    isEmpty,
    displayAvatarURL,
    safeEval,
};
