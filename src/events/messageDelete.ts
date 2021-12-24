import Event from '../struct/Event';
import type KiwiiClient from '../struct/Client';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export default class MessageDelete extends Event {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'messageDelete',
    });
  }

  public override async execute(message: Message) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!this.client.mySql.connected)
      return message.reply(message.guild.i18n.__mf('common.no_conn'));
    const logsChannel = (await this.client.mySql.connection.query(
      'SELECT channelLogs FROM guildsettings WHERE guildId = ?',
      [message.guild.id]
    )) as unknown as {
      channelLogs: string;
    }[][];
    if (!logsChannel[0]?.[0]) return;
    const channel = message.guild.channels.cache.get(
      logsChannel[0][0].channelLogs
    );
    if (!channel) return;
    if (!channel.isText()) return;
    const embed = new MessageEmbed()
      .setTitle('Message deleted')
      .setColor(0xff0000)
      .setDescription(
        `**Message sent by ${message.author.tag}**\n${message.content}`
      )
      .setTimestamp()
      .setFooter(`Message ID: ${message.id} | Author ID: ${message.author.id}`);
    await channel.send({ embeds: [embed] });
  }
}
