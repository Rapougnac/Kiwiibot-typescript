declare module 'translate-google' {
    function enMap(obj: any, expect: any[], path: string, map: any[]): any[];
    function deMap(src: any, maps: any[], dest: string): any;
    /**
     * Translate a string using Google Translate.
     * @param input The input string to translate
     * @param options The options for the translation
     * @param domain The domain to use for the translation
     */
    function translate(
        input: string | object,
        options?: TranslateOptions,
        domain?: string
    ): Promise<string>;

    interface TranslateOptions {
        /**
         * The source language of the input string
         * @default 'auto'
         * @example 'en'
         */
        from?: Languages;
        /**
         * The target language of the output string
         * @default 'en'
         * @example 'de'
         */
        to?: Languages | string;
    }

    type Languages =
        | 'auto'
        | 'af'
        | 'sq'
        | 'ar'
        | 'hy'
        | 'az'
        | 'eu'
        | 'be'
        | 'bn'
        | 'bs'
        | 'bg'
        | 'ca'
        | 'ceb'
        | 'ny'
        | 'zh-cn'
        | 'zh-tw'
        | 'co'
        | 'hr'
        | 'cs'
        | 'da'
        | 'nl'
        | 'en'
        | 'eo'
        | 'et'
        | 'tl'
        | 'fi'
        | 'fr'
        | 'fy'
        | 'gl'
        | 'ka'
        | 'de'
        | 'el'
        | 'gu'
        | 'ht'
        | 'ha'
        | 'haw'
        | 'iw'
        | 'hi'
        | 'hmn'
        | 'hu'
        | 'is'
        | 'ig'
        | 'id'
        | 'ga'
        | 'it'
        | 'ja'
        | 'jw'
        | 'kn'
        | 'kk'
        | 'km'
        | 'ko'
        | 'ku'
        | 'ky'
        | 'lo'
        | 'la'
        | 'lv'
        | 'lt'
        | 'lb'
        | 'mk'
        | 'mg'
        | 'ms'
        | 'ml'
        | 'mt'
        | 'mi'
        | 'mr'
        | 'mn'
        | 'my'
        | 'ne'
        | 'no'
        | 'ps'
        | 'fa'
        | 'pl'
        | 'pt'
        | 'ma'
        | 'ro'
        | 'ru'
        | 'sm'
        | 'gd'
        | 'sr'
        | 'st'
        | 'sn'
        | 'sd'
        | 'si'
        | 'sk'
        | 'sl'
        | 'so'
        | 'es'
        | 'su'
        | 'sw'
        | 'sv'
        | 'tg'
        | 'ta'
        | 'te'
        | 'th'
        | 'tr'
        | 'uk'
        | 'ur'
        | 'uz'
        | 'vi'
        | 'cy'
        | 'xh'
        | 'yi'
        | 'yo'
        | 'zu';

    // Cjs export compatibility
    export = translate;
}
