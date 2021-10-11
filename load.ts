import languageSchema from './src/models/languageSchema';
import PrefixSchema from './src/models/PrefixSchema';
import KiwiiClient from './src/struct/Client';
import mongoose from 'mongoose';

const loadLanguages = async (client: KiwiiClient): Promise<void> => {
    try {
        for (const [id, guild] of client.guilds.cache) {
            if (!mongoose.connection._hasOpened) guild.i18n.setLocale('en');
            const result = await languageSchema.findOne({
                _id: id,
            });
            guild.i18n.setLocale(result ? result.language : 'en');
        }
    } catch (e: any) {
        console.error(
            `⚠️[DATABASE ERROR] The database responded with the following error: ${e.name}\n${e}`
        );
    }
};

const loadPrefix = async (client: KiwiiClient): Promise<void> => {
    try {
        for (const [id, guild] of client.guilds.cache) {
            await PrefixSchema.findOne(
                { GuildID: id },
                (err: Error, data: any) => {
                    if (err) throw err;
                    if (data !== null) {
                        guild.prefix = data.Prefix;
                    }
                }
            );
        }
    } catch (error: any) {
        console.error(
            `⚠️[DATABASE ERROR] The database responded with the following error: ${error.name}\n${error}`
        );
    }
};

export { loadLanguages, loadPrefix };
