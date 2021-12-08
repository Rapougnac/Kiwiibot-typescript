import languageSchema from './src/models/languageSchema';
import PrefixSchema from './src/models/PrefixSchema';
import KiwiiClient from './src/struct/Client';
import mongoose from 'mongoose';

const loadLanguages = async (client: KiwiiClient): Promise<void> => {
    try {
        const asyncResults = [];
        for (const [id, guild] of client.guilds.cache) {
            if (!mongoose.connection._hasOpened)
                return guild.i18n.setLocale('en');
            const result = languageSchema.findOne({
                _id: id,
            });
            asyncResults.push(result);
            // guild.i18n.setLocale(result ? result.language : 'en');
        }

        const results = await Promise.all(asyncResults);
        for (const result of results) {
            if (result) {
                const guild = client.guilds.cache.get(result._id);
                if (guild) {
                    guild.i18n.setLocale(result.language);
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `⚠️[DATABASE ERROR] The database responded with the following error: ${e.name}\n${e}`
        );
    }
};

const loadPrefix = async (client: KiwiiClient): Promise<void> => {
    try {
        for (const [id, guild] of client.guilds.cache) {
            if (!mongoose.connection._hasOpened) return;
            // eslint-disable-next-line no-await-in-loop
            await PrefixSchema.findOne(
                { GuildID: id },
                (err: Error, data: { Prefix: string } | null) => {
                    if (err) throw err;
                    if (data !== null) {
                        guild.prefix = data.Prefix;
                    }
                }
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return Promise.reject(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `⚠️[DATABASE ERROR] The database responded with the following error: ${error.name}\n${error}`
        );
    }
};

export { loadLanguages, loadPrefix };
