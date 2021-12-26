import type i18n from 'i18n';
import type _SetLangCommand from '../commands/core/setlang';

/**
 * LocaleService is a class for managing the locale of the bot.
 * It is used to translate the bot to the language of the guild.
 * The language of the guild is set by the language in the database. (see {@link _SetLangCommand SetLangCommand}).
 * The base language is english. If the language is not supported, the bot will use english.
 * If the translation is not available, the bot will use english.
 */
export default class LocaleService {
  /**
   * The i18n instance.
   */
  i18nProvider: typeof i18n | i18n.I18n;
  /**
   * The locale provider.
   * @param i18nProvider The i18n instance.
   */
  constructor(i18nProvider: typeof i18n | i18n.I18n) {
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
   * * Get the current locale.
   * @returns The available locales.
   * @example
   * ```typescript
   * const locale = localeService.getLocalee();
   * ```
   */
  getLocale(): string {
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
  translate(key: string, replacements: i18n.Replacements): string {
    if (key === this.i18nProvider.__mf(key, replacements)) {
      return this.i18nProvider.__mf(
        {
          phrase: key,
          locale: 'en',
        },
        replacements
      );
    } else {
      return this.i18nProvider.__mf(key, replacements);
    }
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
  __mf(key: string | i18n.TranslateOptions, ...args: unknown[]): string;
  __mf(
    key: string | i18n.TranslateOptions,
    replacements: i18n.Replacements
  ): string {
    if (key === this.i18nProvider.__mf(key, replacements)) {
      return this.i18nProvider.__mf(
        {
          phrase: key,
          locale: 'en',
        },
        replacements
      );
    } else {
      return this.i18nProvider.__mf(key, replacements);
    }
  }
}
