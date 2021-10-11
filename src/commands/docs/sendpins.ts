import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { MessageEmbed, Message, MessageAttachment } from 'discord.js';

export default class SendPinsCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'sendpins',
            aliases: ['sendpinned'],
            description: 'Send all pinned messages',
            category: 'docs',
            utilisation: '{prefix}sendpins',
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
        const pinned = (await message.channel.messages.fetchPinned()).array();
        pinned.reverse();
        message.channel.send(
            pinned.map(
                (pin, i) =>
                    `**${i + 1}** - ${pin.url} - Auteur: ${pin.author.username}`
            )
        );
    }
}
