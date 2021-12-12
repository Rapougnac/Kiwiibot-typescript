import KiwiiClient from './src/struct/Client';
import { error } from './src/util/console';

export const load = async (client: KiwiiClient) => {
    try {
        const asyncResults = [];
        for (const [id, guild] of client.guilds.cache) {
            if (!client.mySql.connected) return guild.i18n.setLocale('en');
            const results = client.mySql.connection.query(
                `SELECT * FROM guildsettings WHERE guildId = ${id}`
            );
            asyncResults.push(results);
        }
        const results = await Promise.all(asyncResults);
        for (const _res of results) {
            // @ts-expect-error: TypeScript doesn't know about the `guildId` column
            const result = _res[0][0];
            if (!result) continue;
            const guild = client.guilds.cache.get(result.guildId);
            if (guild) {
                guild.i18n.setLocale(result.language);
                guild.prefix = result.prefix;
            }
        }
    } catch (e) {
        error(e as string, '[DATABASE]');
    }
};
