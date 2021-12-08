import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { Message } from 'discord.js';

export default class SendPinsCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'sendpins',
            aliases: ['sendpinned'],
            description: 'Send all pinned messages',
            category: 'docs',
            utilisation: '{prefix}sendpins',
            img: 'https://image.flaticon.com/icons/png/512/2377/2377874.png',
            guildOnly: true,
        });
    }

    public async execute(
        _client: KiwiiClient,
        message: Message
    ): Promise<void> {
        const pinned = [
            ...(await message.channel.messages.fetchPinned()),
        ].flat();
        pinned.reverse();
        await message.channel.send(
            pinned
                .map(
                    (pin, i) =>
                        `**${i + 1}** - ${
                            typeof pin === 'string' ? null : pin.url
                        } - Auteur: ${
                            typeof pin === 'string' ? null : pin.author.tag
                        }`
                )
                .join('\n')
        );
    }
}
