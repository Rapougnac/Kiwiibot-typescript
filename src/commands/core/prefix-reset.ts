import { confirmation } from '../../util/confirmation';
import { Message } from 'discord.js';
import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';

export default class PrefixResetCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'prefix-reset',
            aliases: ['pr', 'clearprefix', 'resetprefix'],
            description: 'Reset the prefix to the default one.',
            category: 'core',
            utilisation: '{prefix}prefix-reset',
            guildOnly: true,
            permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message
    ): Promise<Message | void> {
        if (!message.guild) return;
        if (!client.mySql.connected)
            return await message.channel.send(
                message.guild.i18n.__mf('prefix-reset.no_conn')
            );
        const msg = await message.channel.send(
            message.guild.i18n.__mf('prefix-reset.confirmation')
        );

        const emoji = await confirmation(
            message,
            message.author,
            ['✅', '❌'],
            10000
        );

        switch (emoji) {
            case '✅': {
                await msg.delete();
                await client.mySql.connection.query(
                    `UPDATE \`guildsettings\` SET \`prefix\` = NULL WHERE \`guildId\` = ${message.guild.id}`
                );
                message.guild.prefix = client.prefix;
                await message.channel.send(
                    message.guild.i18n.__mf('prefix-reset.reset_prefix', {
                        prefix: client.prefix,
                    })
                );
                break;
            }
            case '❌': {
                await msg.delete();
                return await message.channel.send(
                    message.guild.i18n.__mf('prefix-reset.canceled')
                );
            }
        }
    }
}
