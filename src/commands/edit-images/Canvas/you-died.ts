import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../../struct/Command';
import Client from '../../../struct/Client';
import Canvas from '../../../struct/Canvas';
import { loadImage, createCanvas } from 'canvas';
import { join } from 'path';
export default class YouDiedCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'youdied',
      aliases: ['yd'],
      description: 'Get the your avatar with "You Died" from Dark Souls',
      category: 'edit-images',
      cooldown: 5,
      utilisation: '{prefix}youdied',
    });
  }
  async execute(client: Client, message: Message, args: string[]) {
    const base = await loadImage(
      join(__dirname, '..', '..', '..', 'assets', 'images', 'you-died.png')
    );
    let member =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]) ||
      message.guild?.members.cache.find((r) =>
        r.user.username.toLowerCase().startsWith(args.join(' ').toLowerCase())
      ) ||
      message.guild?.members.cache.find((r) =>
        r.displayName.toLowerCase().startsWith(args.join(' ').toLowerCase())
      ) ||
      message.guild?.members.cache.find((m) =>
        m.user.username.includes(args.join(' '))
      ) ||
      message.member;
    if (args.length <= 0) member = message.member;
    const avatar = member!.user.displayAvatarURL({ size: 2048, format: 'png' });
    const data = await loadImage(avatar);
    const canvas = createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    Canvas.drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
    Canvas.greyscale(ctx, 0, 0, data.width, data.height);
    const { x, y, width, height } = Canvas.centerImage(base, data);
    ctx.drawImage(base, x, y, width, height);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'you-died.png');
    message.channel.send(attachment);
  }
};