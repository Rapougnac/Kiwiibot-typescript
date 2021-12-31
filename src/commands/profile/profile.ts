import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import { createCanvas, loadImage } from 'canvas';
import { MessageAttachment } from 'discord.js';
import type { Message } from 'discord.js';
import * as path from 'path';
import Canvas from '../../struct/Canvas';
import type { Canvas as NodeCanvas } from 'canvas';
import { textTruncate } from '../../util/string';

export default class ProfileCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'profile',
      description: 'See your profile.',
      utilisation: '{prefix}profile',
      category: 'profile',
      clientPermissions: [
        'ATTACH_FILES',
        'EMBED_LINKS',
        'SEND_MESSAGES',
        'VIEW_CHANNEL',
      ],
    });
  }

  public override async execute(_: KiwiiClient, message: Message) {
    if (!message.guild) return;
    const [[bio]] = (await this.client.mySql.connection.query(
      `SELECT bio, thanks FROM usersettings WHERE id = ${message.author.id}`
    )) as unknown as [
      [
        {
          bio?: string;
          thanks?: number;
        }?
      ]
    ];
    const bioText = bio?.bio || 'No bio set.';
    // #region Profile loading
    const img = await loadImage(
      path.join(process.cwd(), 'src', 'assets', 'images', 'Profiles', '1.png')
    );
    const avatar = await loadImage(
      message.author.displayAvatarURL({ format: 'png', size: 4096 })
    );
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.textDrawingMode = 'path';
    ctx.patternQuality = 'best';
    ctx.quality = 'best';
    ctx.filter = 'bilinear';
    ctx.antialias = 'subpixel';
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.save();
    Canvas.roundImage(ctx, 617, 23, 200, 200, 50);
    ctx.clip();
    ctx.drawImage(avatar, 617, 23, 200, 200);
    ctx.restore();
    ctx.fillStyle = 'rgba(42, 51, 85, 0.8)';
    Canvas.roundRectangle(ctx, 50, 156, 450, 117, 10, true);
    ctx.font = '20px Poppins';
    ctx.fillStyle = '#A0DCEC';
    const bioArray = bioText.split(/\s+/g);
    const username = textTruncate(message.author.username, 18);
    if (bioArray.some((word) => word.length > 33)) {
      Canvas.wrap(ctx, bioText, 60, 180, 25, 425);
    } else {
      Canvas.wordWrap(ctx, bioText, 60, 180, 25, 425);
    }
    ctx.fillStyle = 'rgba(42, 51, 85, 0.8)';
    ctx.font = applyText(canvas, username);
    const textWidth = ctx.measureText(username).width + 5;
    Canvas.roundRectangle(ctx, 617, 229, Math.floor(textWidth), 47, 10, true);
    ctx.fillStyle = '#A0DCEC';
    ctx.fillText(username, 617, 261);
    // You can remove this part, this is just a thing from a specific guild
    for (const guild of this.client.config.privateGuilds) {
      if (message.guildId === guild) {
        ctx.fillStyle = '#000000';
        ctx.font = '25px Poppins';
        const thanks = bio?.thanks ?? 0;
        ctx.fillText(
          `${thanks.toString()} ${message.guild.i18n.translatePlural(
            'top.thanks_count',
            thanks
          )}`,
          50,
          145
        );
      }
    }
    // #endregion
    const buffer = canvas.toBuffer('image/png');
    await message.channel.send({
      files: [new MessageAttachment(buffer, 'profile.png')],
    });
  }
}

const applyText = <Text extends string = string>(
  canvas: NodeCanvas,
  text: Text
): `${number}px Poppins` => {
  const ctx = canvas.getContext('2d');
  let fontSize = 40;

  do {
    ctx.font = `${(fontSize -= 5)}px Poppins`;
  } while (ctx.measureText(text).width > canvas.width / 4);

  return ctx.font as `${number}px Poppins`;
};
