import KiwiiClient from './src/struct/Client';
import { I18n } from 'i18n';
import * as path from 'path';

export const load = async (client: KiwiiClient): Promise<void> => {
    try {
        const asyncResults = [];
        for (const [id, guild] of client.guilds.cache) {
            const i18n = new I18n();
            i18n.configure({
                locales: ['en', 'fr', 'de'],
                directory: path.join(process.cwd(), 'locales'),
                defaultLocale: 'en',
                objectNotation: true,
            });
            i18n.setLocale('en');
            Object.defineProperty(guild, 'i18n', {
                value: i18n,
            });
            if (!client.mySql.connected) return guild.i18n.setLocale('en');
            const results = client.mySql.connection.query(
                `SELECT * FROM guildsettings WHERE guildId = ${id}`
            ) as unknown as {
                language: string;
                prefix: string;
                guildId: string;
            }[][];
            asyncResults.push(results);
        }
        const results = await Promise.all(asyncResults);
        for (const [, _res] of results.entries()) {
            const result = _res[0]?.[0];
            if (!result) continue;

            const guild = client.guilds.cache.get(result.guildId);
            if (guild && result.guildId === guild.id) {
                guild.i18n.setLocale(result.language ? result.language : 'en');
                guild.prefix = result.prefix;
                continue;
            } else {
                void Promise.reject(
                    `Guild ${result.guildId} not found, but settings found in database.`
                );
            }
        }
    } catch (e) {
        void Promise.reject(e);
    }
};
