import { Guild } from 'discord.js';
import { I18n } from 'i18n';
import * as path from 'path';
const i18n = new I18n();
i18n.configure({
    locales: ['en', 'fr'],
    directory: path.join(process.cwd(), 'locales'),
    defaultLocale: 'en',
    objectNotation: true,
});
i18n.setLocale('en');
Object.defineProperty(Guild.prototype, 'i18n', {
    value: i18n,
});
