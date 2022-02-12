import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';

export default class BDSMCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'bdsm',
      description: 'Get a hentai pic of the bdsm tag',
      category: 'nsfw',
      utilisation: '{prefix}bdsm',
      nsfw: true,
    });
  }

  public override async execute(_client: KiwiiClient, message: Message) {
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.author.tag} here some bdsm (I'll leave you with your weird delusions)`,
        message.author.displayAvatarURL({
          dynamic: true,
          size: 512,
          format: 'png',
        })
      )
      .setImage(await this.client.utils.akaneko.nsfw.bdsm());
    await message.channel.send({ embeds: [embed] });
  }
}
