import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import { createCanvas, loadImage } from 'canvas';
import { MessageAttachment } from 'discord.js';
import type { Message } from 'discord.js';
import * as path from 'path';
import Canvas from '../../struct/Canvas';
import type { Canvas as NodeCanvas } from 'canvas';

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
    const [[bio]] = (await this.client.mySql.connection.query(
      `SELECT bio FROM usersettings WHERE id = ${message.author.id}`
    )) as unknown as [
      [
        {
          bio?: string;
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
    if (bioArray.some((word) => word.length > 33)) {
      Canvas.wrap(ctx, bioText, 60, 180, 25, 425);
    } else {
      Canvas.wordWrap(ctx, bioText, 60, 180, 25, 425);
    }
    ctx.fillStyle = 'rgba(42, 51, 85, 0.8)';
    ctx.font = applyText(canvas, message.author.username);
    const textWidth = ctx.measureText(message.author.username).width + 5;
    Canvas.roundRectangle(ctx, 617, 229, Math.floor(textWidth), 47, 10, true);
    ctx.fillStyle = '#A0DCEC';
    ctx.fillText(message.author.username, 617, 261);
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
