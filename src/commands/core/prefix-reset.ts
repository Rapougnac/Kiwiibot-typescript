import PrefixSchema from '../../models/PrefixSchema';
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
            permissions: ['MANAGE_MESSAGES'],
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message
    ): Promise<Message | void> {
        const msg = await message.channel.send(
            message.guild!.i18n.__mf('prefix-reset.confirmation')
        );

        const emoji = await confirmation(
            message,
            message.author,
            ['✅', '❌'],
            10000
        );

        switch (emoji) {
            case '✅': {
                msg.delete();
                await PrefixSchema.findOneAndDelete({
                    GuildID: message.guild!.id,
                });
                message.channel.send(
                    message.guild!.i18n.__mf('prefix-reset.reset_prefix', {
                        prefix: client.prefix,
                    })
                );
                break;
            }
            case '❌': {
                msg.delete();
                return message.channel.send(
                    message.guild!.i18n.__mf('prefix-reset.canceled')
                );
            }
        }
    }
}
