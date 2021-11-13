import { Message, MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';

export default class AnalCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'anal',
            description: 'Sends a random anal image/gif',
            category: 'nsfw',
            utilisation: '{prefix}anal',
            cooldown: 5,
            nsfw: true,
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    public async execute(
        client: Client,
        message: Message,
        args: string[]
    ): Promise<Message> {
        const anal = await this.client.utils.neko.nsfw.anal();
        const embed = new MessageEmbed()
            .setColor('#202225')
            .setImage(anal.url)
            .setFooter(
                message.guild!.i18n.__mf('anal.msg', {
                    author: message.author.tag,
                }),
                message.author.displayAvatarURL()
            );
        return message.channel.send({ embeds: [embed] });
    }
}
