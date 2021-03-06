import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import type { Message } from 'discord.js';
import { separateNumbers } from '../../util/string';

export default class PingCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'ping',
      aliases: ['pouing'],
      description: "Send a round trip if you're bored.",
      cooldown: 5,
      category: 'infos',
      utilisation: '{prefix}ping',
      img: 'https://cdn-icons-png.flaticon.com/512/3883/3883802.png',
    });
  }

  public override async execute(
    client: KiwiiClient,
    message: Message
  ): Promise<void> {
    message.channel.sendTyping();
    const msg = await message.reply(`🏓 Pinging....`);
    const ping = msg.createdTimestamp - message.createdTimestamp;

    const string = message.guild?.i18n.__mf('ping.msg', {
      pong: 'o'.repeat(Math.min(Math.round(ping / 100), 1500)),
      ping: separateNumbers(ping, message.guild.i18n.getLocale()),
      heartbeat: separateNumbers(
        client.ws.ping,
        message.guild.i18n.getLocale()
      ),
    });
    await msg.edit(string ?? '🏓 Pong!');
  }
}
