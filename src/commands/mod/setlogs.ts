import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import type { Message } from 'discord.js';

export default class SetLogs extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'setlogs',
            aliases: ['setlog', 'setlogs'],
            description: 'Set the channel where the logs will be sent.',
            utilisation: 'setlogs <#channel>',
            category: 'moderation',
            guildOnly: true,
            permissions: ['MANAGE_GUILD'],
            clientPermissions: ['MANAGE_GUILD', 'VIEW_AUDIT_LOG'],
        });
    }

    public override async execute(
        _client: KiwiiClient,
        message: Message,
        [targetedChannel]: string[]
    ) {
        if (!message.guild) return;
        if (!this.client.mySql.connected)
            return message.reply(message.guild.i18n.__mf('common.no_conn'));
        if (!targetedChannel) targetedChannel = message.channel.id;
        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(targetedChannel) ||
            message.guild.channels.cache.find(
                (c) => c.name === targetedChannel
            );
        if (!channel) return message.reply('This channel does not exist.');
        await this.client.mySql.connection.query(
            'UPDATE guildsettings SET channelLogs = ? WHERE guildId = ?',
            [channel.id, message.guild.id]
        );
        return message.reply('The logs channel has been set.');
    }
}
