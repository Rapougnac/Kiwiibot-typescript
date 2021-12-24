import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export default class AssCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ass',
            aliases: [],
            description: 'Get a pic of an ass',
            category: 'nsfw',
            utilisation: '{prefix}ass',
            nsfw: true,
        });
    }
    public override async execute(client: KiwiiClient, message: Message) {
        const embed = new MessageEmbed()
            .setColor('#FF0000')
            .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                    format: 'png',
                })
            )
            .setImage(await client.utils.akaneko.nsfw.ass())
            .setFooter(`Requested by ${message.author.username}`);
        await message.channel.send({ embeds: [embed] });
    }
}
