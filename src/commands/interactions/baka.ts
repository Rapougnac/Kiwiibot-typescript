import { MessageEmbed, Message } from 'discord.js';
import KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';

export default class BakaCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'baka',
            description: 'Say baka to somebody',
            category: 'interactions',
            utilisation: '{prefix}baka <user>',
            img: 'https://i.pinimg.com/originals/9e/d5/9c/9ed59cfddb8386ad37683eebc2619f50.png',
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
        if (!message.guild) return;
        let member =
            message.mentions.members!.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(
                (r) =>
                    r.user.username.toLowerCase() ===
                    args.join(' ').toLocaleLowerCase()
            ) ||
            message.guild.members.cache.find(
                (r) =>
                    r.displayName.toLowerCase() ===
                    args.join(' ').toLocaleLowerCase()
            );
        if (args.length === 0) member = undefined;
        if (!member) {
            const GIF = await client.utils.neko.sfw.baka();
            const embed = new MessageEmbed()
                .setColor('#202225')
                .setTitle(
                    message.guild.i18n.__mf('baka.title_alone', {
                        author: message.author.tag,
                    })
                )
                .setImage(GIF.url)
                .setURL(GIF.url);
            message.channel.send({ embeds: [embed] });
        } else {
            const GIF = await client.utils.neko.sfw.baka();
            const embed = new MessageEmbed()
                .setColor('#202225')
                .setTitle(
                    message.guild.i18n.__mf('baka.title_smbdy', {
                        author: message.author.tag,
                        member: member.user.tag,
                    })
                )
                .setURL(GIF.url)
                .setImage(GIF.url);
            message.channel.send({ embeds: [embed] });
        }
    }
}
