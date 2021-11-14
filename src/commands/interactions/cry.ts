import { Message, MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
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

    public execute(_client: Client, message: Message) {
        const gif = gifu('cry');
        const embed = new MessageEmbed()
            .setColor('#202225')
            .setImage(gif)
            .setTitle(
                message.guild!.i18n.__mf('cry.msg', {
                    author: message.author.tag,
                })
            );
        message.channel.send({ embeds: [embed] });
    }
}
