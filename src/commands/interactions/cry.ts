import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import type Client from '../../struct/Client';
import { gifu } from 'gifu';

export default class CryCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'cry',
            description: 'Cry',
            category: 'interactions',
            utilisation: 'cry',
        });
    }

    public async execute(_client: Client, message: Message) {
        const gif = gifu('cry');
        const embed = new MessageEmbed()
            .setColor('#202225')
            .setImage(gif)
            .setTitle(
                message.guild?.i18n.__mf('cry.msg', {
                    author: message.author.tag,
                }) ?? 'Cry'
            );
        await message.channel.send({ embeds: [embed] });
    }
}
