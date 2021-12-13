import KiwiiClient from './src/struct/Client';
import { error } from './src/util/console';

export const load = async (client: KiwiiClient) => {
    try {
        // await checkIfDbExists(client);
        // const asyncResults = [];
        // const guilds = [...client.guilds.cache.values()];
        for (const [id, guild] of client.guilds.cache) {
            if (!client.mySql.connected) return guild.i18n.setLocale('en');
            // eslint-disable-next-line no-await-in-loop
            const results = (await client.mySql.connection.query(
                `SELECT * FROM guildsettings WHERE guildId = ${id}`
            )) as unknown as {
                language: string;
                prefix: string;
            }[][];
            // asyncResults.push(results);
            guild.i18n.setLocale(
                results[0]?.[0]?.language ? results[0][0].language : 'en'
            );
        }
        // const results = await Promise.all(asyncResults);
        // for (const [i, _res] of results.entries()) {
        //     // @ts-expect-error: TypeScript doesn't know about the `guildId` column
        //     const result = _res[0][0];
        //     const _guild = guilds[i];
        //     _guild?.i18n.setLocale('en');
        //     if (!result) {
        //         // _guild?.i18n.setLocale('en');
        //         continue;
        //     }
        //     const guild = client.guilds.cache.get(result.guildId);
        //     if (guild && result.guildId === guild.id) {
        //         guild.i18n.setLocale(result.language ? result.language : 'en');
        //         guild.prefix = result.prefix;
        //         continue;
        //     } else {
        //         error(
        //             `Guild ${result.guildId} not found, but settings found in database.`
        //         );
        //     }
        // }
    } catch (e) {
        error(e as string, '[DATABASE]');
    }
};

// const checkIfDbExists = async (client: KiwiiClient) => {
//     const exists = await client.mySql.connection.query(
//         `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'guildsettings'`
//     );
//     //@ts-expect-error: TypeScript doesn't know about the `table_name` column
//     if (exists[0].length === 0) {
//         await client.mySql.connection.query(
//             `CREATE TABLE guildsettings (
//                 guildId CHAR(18) NOT NULL,
//                 prefix VARCHAR(5) NOT NULL,
//                 language VARCHAR(255) NOT NULL DEFAULT 'en',
//                 PRIMARY KEY (guildId)
//             )`
//         );
//     }
// };
