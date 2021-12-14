import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';

export default class PollCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'poll',
            category: 'core',
            utilisation: '{prefix}poll [question]',
            cooldown: 5,
            nsfw: false,
            adminOnly: true,
            clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
            img: 'https://image.flaticon.com/icons/png/512/3189/3189478.png',
        });
    }
    public async execute(
        _client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<Message | void> {
        const reactions = [
            '🇦',
            '🇧',
            '🇨',
            '🇩',
            '🇪',
            '🇫',
            '🇬',
            '🇭',
            '🇮',
            '🇯',
            '🇰',
            '🇱',
            '🇲',
            '🇳',
            '🇴',
            '🇵',
            '🇶',
            '🇷',
            '🇸',
            '🇹',
            '🇺',
            '🇻',
        ];

        const choices = args.join(' ').split(' | ').slice(1);
        const question = args.join(' ').split('|')[0];

        if (!question)
            return message.channel.send('Please, give me a valid question');
        if (!choices.length)
            return message.channel.send(
                'Please, indicate at least one choice.'
            );
        if (choices.length)
            return message.channel.send('It can be more than 20 choices!');
        void message.delete();
        const sent = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(question)
                    .setDescription(
                        choices
                            .map((choice, i) => `${reactions[i]} ${choice}`)
                            .join('\n\n')
                    ),
            ],
        });

        for (const reaction of reactions) void sent.react(reaction);
    }
}
