import type i18n from 'i18n';

/**
 * LocaleService
 */
export default class LocaleService {
    /**
     * The i18n instance.
     */
    i18nProvider: typeof i18n;
    /**
     * The locale provider.
     * @param i18nProvider The i18n instance.
     */
    constructor(i18nProvider: typeof i18n) {
        this.i18nProvider = i18nProvider;
    }

    /**
     * * Get the current locale.
     * @returns The current locale.
     */
    getCurrentLocale(): string {
        return this.i18nProvider.getLocale();
    }

    /**
     * * Get all available locales.
     * @returns The list of available locales.
     */
    getLocales(): string[] {
        return this.i18nProvider.getLocales();
    }

    /**
     * * Set the locale.
     * @param locale The locale to set.
     * @returns Nothing.
     */
    setLocale(locale: string): void {
        if (this.getLocales().indexOf(locale) > -1)
            return this.i18nProvider.setLocale(locale);
        else throw new Error(`Locale ${locale} is not available.`);
    }

    /**
     * * Get the translation for a key.
     * @param key The key to translate.
     * @param args The arguments to pass to the translation.
     * @returns The translated string.
     */
    translate(key: string, ...args: unknown[]): string {
        return this.i18nProvider.__mf(key, ...args);
    }

    /**
     * * Get the translation for a key.
     * @param key The key to translate.
     * @param count The count to pass to the translation.
     * @returns The translated string.
     */
    translatePlural(key: string, count: number): string {
        return this.i18nProvider.__n(key, count);
    }

    /**
     * * Same to {@link i18n.__mf}
     * @param key The key to get
     * @param args The arguments to pass to the translation
     */
    __mf(key: string, ...args: unknown[]): string {
        return this.i18nProvider.__mf(key, args);
    }
}
