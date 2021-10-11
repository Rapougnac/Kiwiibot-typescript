import { Message, MessageEmbed } from 'discord.js';
import KiwiiClient from '../../struct/Client';
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
        });
    }
    public async execute(
        client: KiwiiClient,
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
        message.delete();
        const sent = await message.channel.send(
            new MessageEmbed()
                .setTitle(question)
                .setDescription(
                    choices
                        .map((choice, i) => `${reactions[i]} ${choice}`)
                        .join('\n\n')
                )
        );

        for (const reaction of reactions) sent.react(reaction);
    }
}
