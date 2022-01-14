/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
    /**
     * Create a new `Intl.ListFormat` instance.
     */
    class ListFormat {
        /**
         * The `Intl.ListFormat()` constructor creates {@link Intl.ListFormat} objects that enable language-sensitive list formatting. 
         * @param locale A string with a BCP 47 language tag, or an array of such strings. For the general form and interpretation of the locales argument, see the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation) page. 
         * @param options An object with some or all of the following properties:
         */
        public constructor(locale: string, options?: ListFormatOptions);

        /**
         * The `format()` method returns a string with a language-specific representation of the list.
         * 
         * The **`format()`** method returns a string that has been formatted based on parameters provided in the `Intl.ListFormat` object.
         * The `locales` and `options` parameters customize the behavior of `format()` and let applications specify the language conventions that should be used to format the list. 
         * 
         * @param list An iterable object, such as an array, that contains the values to be formatted.
         * @returns A language-specific formatted string representing the elements of the list.
         * 
         * # Examples
         * 
         * ## Using format()
         * The following example shows how to create a List formatter using the English language.
         * ```ts
         * const list = ['Motorcycle', 'Bus', 'Car'];
         *
         * console.log(new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(list));
         * // > Motorcycle, Bus and Car
         * console.log(new Intl.ListFormat('en-GB', { style: 'short', type: 'disjunction' }).format(list));
         * // > Motorcycle, Bus or Car¨
         * console.log(new Intl.ListFormat('en-GB', { style: 'narrow', type: 'unit' }).format(list));
         * // > Motorcycle Bus Car
         * ```
         */
        public format(list: string[]): string;

        /**
         * The `Intl.ListFormat.prototype.formatToParts()` method returns an {@link Array `Array`} 
         * of objects representing the different components that can be used to format a list of values in a locale-aware fashion. 
         * 
         * Whereas {@link Intl.ListFormat.prototype.format() `Intl.ListFormat.prototype.format()`} returns a string being the formatted version of the list (according to the given locale and style options),
         * `formatToParts()` returns an array of the different components of the formatted string. 
         * 
         * Each element of the resulting array has two properties: `type` and `value`. The `type` property may be either "`element`", which refers to a value from the list,
         * or "`literal`" which refers to a linguistic construct.
         * The `value` property gives the content, as a string, of the token.
         *  
         * @param list An iterable object, such as an {@link Array `Array`}, to be formatted according to a locale.
         * @returns An {@link Array `Array`} of components which contains the formatted parts from the list.
         * 
         * # Examples
         * ## Using `formatToParts()`
         * ```ts
         * const fruits = ['Orange', 'Apple', 'Banana'];
         * const listFormatter = new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' });
         * 
         * console.log(listFormatter.formatToParts(fruits));
         * // [
         * //   { type: 'element', value: 'Orange' },
         * //   { type: 'literal', value: ', ' },
         * //   { type: 'element', value: 'Apple' },
         * //   { type: 'literal', value: ', and' },
         * //   { type: 'element', value: 'Banana' }
         * // ]
         * ```
         */
        public formatToParts(list: string[]): Segment[];

        /**
         * The `Intl.ListFormat.supportedLocalesOf()` method returns an array containing those of the provided locales that are supported in list formatting without having to fall back to the runtime's default locale. 
         * 
         * Returns an array with a subset of the language tags provided in locales. 
         * The language tags returned are those for which the runtime supports a locale in list formatting that the locale matching algorithm used considers a match, 
         * so that it wouldn't have to fall back to the default locale. 
         * 
         * @param locales A string with a BCP 47 language tag, or an array of such strings. For the general form and interpretation of the locales argument, see the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation) page.
         * @param options An object that may have the following property:
         * @returns  An array of strings representing a subset of the given locale tags that are supported in list formatting without having to fall back to the runtime's default locale.
         * # Examples
         * 
         * ## Using `supportedLocalesOf()`
         * Assuming a runtime that supports Indonesian and German but not Balinese in list formatting, 
         * `supportedLocalesOf` returns the Indonesian and German language tags unchanged, even though `pinyin` collation is neither relevant to list formatting nor used with Indonesian, 
         * and a specialized German for Indonesia is unlikely to be supported. Note the specification of the "`lookup`" algorithm here — a "`best fit`"
         * matcher might decide that Indonesian is an adequate match for Balinese since most Balinese speakers also understand Indonesian, and therefore return the Balinese language tag as well. 
         * ```ts
         * const locales = ['ban', 'id-u-co-pinyin', 'de-ID'];
         * const options = { localeMatcher: 'lookup' };
         * console.log(Intl.ListFormat.supportedLocalesOf(locales, options).join(', '));
         * // → "id-u-co-pinyin, de-ID"
         * ```
         */
        public static supportedLocalesOf(locales: string | string[], options?: Omit<ListFormatOptions, 'type' | 'style'>): string[];
    }

    interface Segment {
        value: string;
        type: 'literal' | 'select' | 'plural';
    }

    /**
     * An object with some or all of the following properties:
     */
    interface ListFormatOptions {
        /**
         * The locale matching algorithm to use. Possible values are "`lookup`" and "`best fit`"; 
         * the default is "`best fit`". For information about this option, see the
         * [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_negotiation) page. 
         */
        localeMatcher?: 'lookup' | 'best fit';

        /**
         * The format of output message. 
         * Possible values are "`conjunction`" that stands for "and"-based lists (default, e.g., "`A, B, and C`"),
         * or "`disjunction`" that stands for "or"-based lists (e.g., "`A, B, or C`"). 
         * "`unit`" stands for lists of values with units (e.g., "`5 pounds, 12 ounces`"). 
         */
        type?: 'conjunction' | 'disjunction' | 'unit';

        /**
         * The length of the formatted message.
         * Possible values are: "`long`" (default, e.g., "`A, B, and C`");
         * "`short`" (e.g., "`A, B, C`"),
         * or "`narrow`" (e.g., "A B C").
         * When `style` is "`short`" or "`narrow`", "`unit`" is the only allowed value for the type option. 
         */
        style?: 'long' | 'short' | 'narrow';
    }
}
