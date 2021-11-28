import { loadImage, createCanvas } from 'canvas';
import { join } from 'path';
import Canvas from '../../../struct/Canvas';
import Command from '../../../struct/Command';
import KiwiiClient from '../../../struct/Client';
import { Message, MessageAttachment } from 'discord.js';

export default class RipCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'rip',
            description: 'Rip',
            category: 'edit-images',
            utilisation: '{prefix}rip <member>',
            clientPermissions: [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
                'ATTACH_FILES',
            ],
            img: 'https://cdn-icons-png.flaticon.com/512/1301/1301675.png',
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
        const User =
            message.mentions.members?.first() ||
            message.guild?.members.cache.get(args[0]!) ||
            message.guild?.members.cache.find((r) =>
                r.user.username
                    .toLowerCase()
                    .startsWith(args.join(' ').toLowerCase())
            ) ||
            message.guild?.members.cache.find((r) =>
                r.displayName
                    .toLowerCase()
                    .startsWith(args.join(' ').toLowerCase())
            );

        if (User !== undefined && message.guild?.available) {
            try {
                client.utils.loader.start({
                    length: 4,
                    time: 1000,
                    allowMessage: true,
                    message,
                    deleteMessage: true,
                });
                message.channel.sendTyping();
                const avatarURL = User.displayAvatarURL({
                    format: 'png',
                    size: 512,
                });

                const cause = args.slice(1).join(' ');
                const base = await loadImage(
                    join(process.cwd(), 'src', 'assets', 'images', 'rip.png')
                );
                const avatar = await loadImage(avatarURL);
                const canvas = createCanvas(base.width, base.height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(base, 0, 0);
                ctx.drawImage(avatar, 194, 399, 500, 500);
                Canvas.greyscale(ctx, 194, 399, 500, 500);
                ctx.textBaseline = 'top';
                ctx.textAlign = 'center';
                ctx.font = '45px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(User.user.username, 438, 330, 500);
                ctx.fillText(cause, 438, 330, 500);
                ctx.fillText('In memory of', 438, 292);
                const att = new MessageAttachment(canvas.toBuffer(), 'rip.png');
                return message.channel.send({ files: [att] });
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                client.utils.loader.start({
                    length: 4,
                    time: 1000,
                    allowMessage: true,
                    message,
                    deleteMessage: true,
                });
                message.channel.sendTyping();
                const avatarURL = message.author.displayAvatarURL({
                    size: 512,
                    format: 'png',
                });
                const cause = args.join(' ');
                const base = await loadImage(
                    join(process.cwd(), 'src', 'assets', 'images', 'rip.png')
                );
                const avatar = await loadImage(avatarURL);
                const canvas = createCanvas(base.width, base.height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(base, 0, 0);
                ctx.drawImage(avatar, 194, 399, 500, 500);
                Canvas.greyscale(ctx, 194, 399, 500, 500);
                ctx.textBaseline = 'top';
                ctx.textAlign = 'center';
                ctx.font = '45px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText('In memory of', 438, 292);
                ctx.fillText(message.author.username, 438, 330, 500);
                ctx.fillStyle = 'black';
                if (cause) ctx.fillText(cause, 438, 910, 500);
                const att = new MessageAttachment(canvas.toBuffer(), 'rip.png');
                return message.channel.send({ files: [att] });
            } catch (error) {
                console.error(error);
            }
        }
    }
}
