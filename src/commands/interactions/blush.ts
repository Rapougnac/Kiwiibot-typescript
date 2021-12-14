import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import { gifu } from 'gifu';
import { MessageEmbed } from 'discord.js';

export default class BlushCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'blush',
            description: "Haaa you're blushing!",
            category: 'interactions',
            utilisation: '{prefix}blush',
        });
    }

    public async execute(): Promise<void> {
        const result = gifu('blush');

        const blushEmbed = new MessageEmbed()
            .setTitle(
                this.message?.guild?.i18n.__mf('blush.msg', {
                    author: this.message.author.tag,
                }) as string
            )
            .setColor('#202225')
            .setImage(result)
            .setURL(result);
        await this.message?.channel.send({ embeds: [blushEmbed] });
    }
}
