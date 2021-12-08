import PrefixSchema from '../../models/PrefixSchema';
import { Message } from 'discord.js';
import mongoose, { Document } from 'mongoose';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class SetPrefixCommand extends Command {
    constructor(client: Client) {
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
    public async execute(
        _client: Client,
        message: Message,
        [prefix]: string[]
    ): Promise<Message | void> {
        if (!message.guild) return;
        if (!mongoose.connection._hasOpened)
            return await message.channel.send(
                message.guild.i18n.__mf('setprefix.no_conn')
            );
        if (!prefix) {
            return message.channel.send(
                message.guild.i18n.__mf('setprefix.missing_prefix')
            );
        } else if (prefix.length > 5) {
            return message.channel.send(
                message.guild.i18n.__mf('setprefix.prefix_length')
            );
        }

        PrefixSchema.findOne(
            { GuildID: message.guild.id },
            async (err: Error, data: Document) => {
                if (err)
                    return message.channel.send(
                        message.guild?.i18n.__mf('common.database_error', {
                            error: err.name,
                        }) ?? 'Database error'
                    );
                if (data) {
                    await PrefixSchema.findOneAndDelete({
                        GuildID: message.guild?.id,
                    });
                    data = new PrefixSchema({
                        GuildID: message.guild?.id,
                        Prefix: prefix,
                    });
                    await data.save();
                    if (message.guild) message.guild.prefix = prefix;
                    await message.channel.send(
                        message.guild?.i18n.__mf('setprefix.updated_prefix', {
                            prefix: prefix,
                        }) ?? 'Updated prefix'
                    );
                } else {
                    data = new PrefixSchema({
                        GuildID: message.guild?.id,
                        Prefix: prefix,
                    });
                    await data.save();
                    if (message.guild) message.guild.prefix = prefix;
                    await message.channel.send(
                        message.guild?.i18n.__mf('setprefix.new_prefix', {
                            prefix: prefix,
                        }) ?? 'New prefix'
                    );
                }
            }
        );
    }
}
