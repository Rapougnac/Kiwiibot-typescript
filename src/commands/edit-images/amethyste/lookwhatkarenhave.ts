import { MessageAttachment } from 'discord.js';
import type { Message } from 'discord.js';
import type KiwiiClient from '../../../struct/Client';
import Command from '../../../struct/Command';
export default class LookWhatKarenhave extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'lookwhatkarenhave',
      aliases: ['lwkh'],
      description: "Well, it's all in the name, look what Karen have.",
      utilisation: `{prefix}lookwhatkarenhave <member>`,
      category: 'image-manipulation',
      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES'],
    });
  }
  public override async execute(
    _client: KiwiiClient,
    message: Message,
    args: string[]
  ) {
    if (!message.guild) return;
    const User =
      message.mentions.members?.first() ||
      message.guild.members.cache.get(args[0] ?? '') ||
      message.guild.members.cache.find((r) =>
        r.user.username.toLowerCase().startsWith(args.join(' ').toLowerCase())
      ) ||
      message.guild.members.cache.find((r) =>
        r.displayName.toLowerCase().startsWith(args.join(' ').toLowerCase())
      ) ||
      message.member;
    const m = await message.channel.send(
      message.guild.i18n.__mf('common.wait')
    );
    const buffer = await this.client.utils.AmeAPI.generate(
      'lookwhatkarenhave',
      {
        url:
          User?.user.displayAvatarURL({
            format: 'png',
            size: 2048,
          }) ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
      }
    );
    const attachment = new MessageAttachment(buffer, 'lookwhatkarenhave.png');
    setTimeout(() => m.delete(), 3000);
    await message.channel.send({ files: [attachment] });
  }
}
