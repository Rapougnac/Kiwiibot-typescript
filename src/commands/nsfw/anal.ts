import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import type Client from '../../struct/Client';

export default class AnalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'anal',
      description: 'Sends a random anal image/gif',
      category: 'nsfw',
      utilisation: '{prefix}anal',
      cooldown: 5,
      nsfw: true,
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  public async execute(
    _client: Client,
    message: Message
  ): Promise<Message | undefined> {
    if (!message.guild) return;
    const anal = await this.client.utils.neko.nsfw.anal();
    const embed = new MessageEmbed()
      .setColor('#202225')
      .setImage(anal.url)
      .setFooter(
        message.guild.i18n.__mf('anal.msg', {
          author: message.author.tag,
        }),
        message.author.displayAvatarURL()
      );
    return message.channel.send({ embeds: [embed] });
  }
}
