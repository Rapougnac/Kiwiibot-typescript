import Command from '../../../struct/Command';
import KiwiiClient from '../../../struct/Client';
import { Message, MessageAttachment, GuildMember } from 'discord.js';

export default class AfusionCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'fusion',
            aliases: ['afusion'],
            description:
                'Fusionnate your profile picture with the specified member',
            category: 'image-manipulation',
            utilisation: '{prefix}fusion [member]',
            guildOnly: true,
            clientPermissions: [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
                'ATTACH_FILES',
            ],
        });
    }
    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<void> {
        message.channel.sendTyping();
        let member =
            message.mentions.members!.first() ||
            message.guild!.members.cache.get(args[0]!) ||
            message.guild!.members.cache.find(
                (r) =>
                    r.user.username
                        .toLowerCase()
                        .startsWith(args.join(' ').toLowerCase()) ||
                    r.user.username
                        .toLowerCase()
                        .endsWith(args.join(' ').toLowerCase())
            ) ||
            message.guild!.members.cache.find(
                (r) =>
                    r.displayName
                        .toLowerCase()
                        .startsWith(args.join(' ').toLowerCase()) ||
                    r.displayName
                        .toLowerCase()
                        .endsWith(args.join(' ').toLowerCase())
            );
        if (args.length === 0) member = message.member as GuildMember;
        const m = await message.channel.send(
            message.guild!.i18n.__mf('common.wait')
        );
        const buffer = await client.utils.AmeAPI.generate('afusion', {
            url: member!.user.displayAvatarURL({
                format: 'png',
                size: 2048,
            }) as string,
            avatar: message.author.displayAvatarURL({
                format: 'png',
                size: 2048,
            }),
        });
        const attachment = new MessageAttachment(buffer, 'fusion.png');
        setTimeout(() => m.delete(), 3000);
        message.channel.send({ files: [attachment] });
    }
}
