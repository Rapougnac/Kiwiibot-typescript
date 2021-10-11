import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../../struct/Command';
import Client from '../../../struct/Client';
import fetch from 'node-fetch';
export default class PHCommentCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'phcomment',
            aliases: ['commentph', 'ph'],
            description: 'Write a comment in ph ( ͡• ͜ʖ ͡• )',
            category: 'edit-images',
            cooldown: 5,
            utilisation: '{prefix}phcomment <user> [text]',
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async execute(client: Client, message: Message, args: string[]) {
        if(!message.mentions.members) return;
        if(!message.guild) return;
        const User =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find((r) =>
                r.user.username.toLowerCase().startsWith(args[0].toLowerCase())
            ) ||
            message.guild.members.cache.find((r) =>
                r.displayName.toLowerCase().startsWith(args[0].toLowerCase())
            );
        if (User) {
            const query = args.slice(1).join(' ');
            const data: any = await fetch(
                `https://nekobot.xyz/api/imagegen?type=phcomment&image=${User.user.displayAvatarURL()}&text=${encodeURIComponent(
                    query
                )}&username=${encodeURIComponent(User.user.username)}`
            ).then((res) => res.json());
            const att = new MessageAttachment(data.message);
            message.channel.send(att);
        } else {
            const query = args.join(' ');
            const data: any = await fetch(
                `https://nekobot.xyz/api/imagegen?type=phcomment&image=${message.author.displayAvatarURL()}&text=${encodeURIComponent(
                    query
                )}&username=${encodeURIComponent(message.author.username)}`
            ).then((res) => res.json());
            const att = new MessageAttachment(data.message);
            message.channel.send(att);
        }
    }
};
