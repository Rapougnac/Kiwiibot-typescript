import { Message, MessageAttachment, GuildMember } from 'discord.js';
import Command from '../../../struct/Command';
import Client from '../../../struct/Client';
export default class ThreeTousandYearsCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: '3000y',
            aliases: [],
            description:
                'Sends you, or the specified member with the 3000y meme',
            category: 'image-manipulation',
            cooldown: 5,
            utilisation: '{prefix}3000y <member>',
            clientPermissions: [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
                'ATTACH_FILES',
            ],
        });
    }
    async execute(client: Client, message: Message, args: string[]) {
        if (message.guild && message.guild.available) {
            message.channel.sendTyping();
            let member =
                message.mentions.members?.first() ||
                message.guild.members.cache.get(args[0]!) ||
                message.guild.members.cache.find(
                    (r) =>
                        r.user.username
                            .toLowerCase()
                            .startsWith(args.join(' ').toLowerCase()) ||
                        r.user.username
                            .toLowerCase()
                            .endsWith(args.join(' ').toLowerCase())
                ) ||
                message.guild.members.cache.find(
                    (r) =>
                        r.displayName
                            .toLowerCase()
                            .startsWith(args.join(' ').toLowerCase()) ||
                        r.displayName
                            .toLowerCase()
                            .endsWith(args.join(' ').toLowerCase())
                );
            if (args.length <= 0)
                member = message.member as GuildMember | undefined;
            const m = await message.channel.send(
                message.guild.i18n.__mf('common.wait')
            );
            const buffer = await client.utils.AmeAPI.generate('3000years', {
                url: member!.user.displayAvatarURL({
                    format: 'png',
                    size: 2048,
                }),
            });
            const attachment = new MessageAttachment(buffer, '3000years.png');
            setTimeout(() => m.delete(), 3000);
            message.channel.send({ files: [attachment] });
        } else {
            const member = message.author;
            const m = await message.channel.send(
                message.guild!.i18n.__mf('common.wait')
            );
            const buffer = await client.utils.AmeAPI.generate('3000years', {
                url: member.displayAvatarURL({ format: 'png', size: 2048 }),
            });
            const attachment = new MessageAttachment(buffer, '3000years.png');
            setTimeout(() => m.delete(), 3000);
            message.channel.send({ files: [attachment] });
        }
    }
}
