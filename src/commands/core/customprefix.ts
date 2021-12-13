import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { Message } from 'discord.js';

export default class CustomPrefixRef extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'setprefix',
            aliases: ['setp'],
            description:
                'Change the default prefix to the specified prefix, you can still use the default prefix',
            category: 'core',
            cooldown: 5,
            utilisation: '{prefix}setprefix [prefix]',
            guildOnly: true,
            permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            img: 'https://image.flaticon.com/icons/png/512/1799/1799807.png',
        });
    }
    public override async execute(
        client: KiwiiClient,
        message: Message,
        [prefix]: string[]
    ) {
        if (!message.guild) return;
        if (!client.mySql.connected)
            return await message.channel.send(
                message.guild.i18n.__mf('setprefix.no_conn')
            );
        if (!prefix)
            return await message.channel.send(
                message.guild.i18n.__mf('setprefix.missing_prefix')
            );
        else if (prefix.length > 5)
            return await message.channel.send(
                message.guild.i18n.__mf('setprefix.prefix_length')
            );

        const prefixes = await client.mySql.connection.query(
            'SELECT * FROM guildSettings'
        );
        const prefixesArray = prefixes.map((prefix: any) => prefix.prefix);
        if (prefixesArray.includes(prefix)) {
            await client.mySql.connection.query(
                `INSERT INTO \`guildsettings\` (\`guildId\`, \`prefix\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`prefix\` = ?`,
                [message.guild.id, prefix, prefix]
            );
            message.guild.prefix = prefix;
            return await message.channel.send(
                message.guild.i18n.__mf('setprefix.updated_prefix', {
                    prefix: prefix,
                })
            );
        }

        await client.mySql.connection.query(
            `INSERT INTO \`guildsettings\` (\`guildId\`, \`prefix\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`prefix\` = ?`,
            [message.guild.id, prefix, prefix]
        );
        message.guild.prefix = prefix;
        return await message.channel.send(
            message.guild.i18n.__mf('setprefix.new_prefix', {
                prefix,
            })
        );
    }
}
