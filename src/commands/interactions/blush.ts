import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { gifu } from 'gifu';
import { MessageEmbed } from 'discord.js';

export default class BlushCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'blush',
            description: "Haaa you're blushing!",
            category: 'interaction',
            utilisation: '{prefix}blush',
        });
    }

    public async execute(): Promise<void> {
        const result = gifu('blush');

        const blushEmbed = new MessageEmbed()
            .setTitle(
                this.message!.guild?.i18n.__mf('blush.msg', {
                    author: this.message?.author.tag,
                })
            )
            .setColor('#202225')
            .setImage(result)
            .setURL(result);
        this.message?.channel.send(blushEmbed);
    }
}
