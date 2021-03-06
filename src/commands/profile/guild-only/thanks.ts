import Command from '../../../struct/Command';
import type KiwiClient from '../../../struct/Client';
import type { Message } from 'discord.js';

let cache: string[] = [];
clearCache();

export default class ThanksCommand extends Command {
  constructor(client: KiwiClient) {
    super(client, {
      name: 'thanks',
      aliases: ['thx'],
      description: 'Send a round thanks to the user',
      cooldown: 5,
      category: 'profile',
      utilisation: '{prefix}thanks [user]',
      guildOnly: true,
      private: true,
    });
  }

  public override async execute(
    _: KiwiClient,
    message: Message,
    args: string[]
  ): Promise<void | Message> {
    if (!message.guild) return;
    const member =
      message.mentions.members?.first() ||
      message.guild.members.cache.get(args.join(' ')) ||
      message.guild.members.cache.find((r) =>
        r.user.username.toLowerCase().startsWith(args.join(' ').toLowerCase())
      ) ||
      message.guild.members.cache.find((r) =>
        r.displayName.toLowerCase().endsWith(args.join(' ').toLowerCase())
      ) ||
      message.guild.members.cache.find((m) =>
        m.displayName.includes(args.join(' '))
      ) ||
      message.member;
    if (cache.includes(message.author.id)) {
      return message.reply(message.guild.i18n.translate('thanks.rateLimit'));
    }
    if (!member || args.length === 0)
      return message.reply(message.guild.i18n.translate('thanks.noMember'));
    if (member.id === message.author.id)
      return message.reply(message.guild.i18n.translate('thanks.self'));
    const [[thanks]] = (await this.client.mySql.connection.query(
      'SELECT thanks FROM usersettings WHERE id = ?',
      [member.id]
    )) as unknown as [[{ thanks: number | null }?]];
    const [[rateLimit]] = (await this.client.mySql.connection.query(
      'SELECT rateLimitedUpdatedAt FROM usersettings WHERE id = ?',
      [message.author.id]
    )) as unknown as [[{ rateLimitedUpdatedAt: Date | null }?]];
    if (!thanks) {
      if (rateLimit?.rateLimitedUpdatedAt) {
        const then = rateLimit.rateLimitedUpdatedAt.getTime();
        const now = new Date().getTime();

        const difference = Math.abs(now - then);
        const days = Math.round(difference / (1000 * 60 * 60 * 24));

        if (days <= 1) {
          cache.push(message.author.id);

          return message.reply(
            message.guild.i18n.translate('thanks.rateLimit')
          );
        }
      }
      await this.client.mySql.connection.query(
        'INSERT INTO usersettings (id, thanks) VALUES (?, ?) ON DUPLICATE KEY UPDATE thanks = ?',
        [member.id, 1, 1]
      );
      await this.client.mySql.connection.query(
        'INSERT INTO usersettings (id, rateLimitedUpdatedAt) VALUES(?, ?) ON DUPLICATE KEY UPDATE rateLimitedUpdatedAt = ?',
        [
          message.author.id,
          jsDateToMySql(new Date(Date.now())),
          jsDateToMySql(new Date(Date.now())),
        ]
      );
    } else {
      if (rateLimit?.rateLimitedUpdatedAt) {
        const then = rateLimit.rateLimitedUpdatedAt.getTime();
        const now = new Date().getTime();

        const difference = Math.abs(now - then);
        const days = Math.round(difference / (1000 * 60 * 60 * 24));

        if (days <= 1) {
          cache.push(message.author.id);

          return message.reply(
            message.guild.i18n.translate('thanks.rateLimit')
          );
        }
      }
      await this.client.mySql.connection.query(
        'UPDATE usersettings SET thanks = ? WHERE id = ?',
        [Number(thanks.thanks) + 1, member.id]
      );
      await this.client.mySql.connection.query(
        'INSERT INTO usersettings (id, rateLimitedUpdatedAt) VALUES(?, ?) ON DUPLICATE KEY UPDATE rateLimitedUpdatedAt = ?',
        [
          message.author.id,
          jsDateToMySql(new Date(Date.now())),
          jsDateToMySql(new Date(Date.now())),
        ]
      );
    }
    cache.push(message.author.id);
    return message.channel.send(
      message.guild.i18n.__mf('thanks.thanked', {
        member: member.displayName,
        author: message.author.username,
      })
    );
  }
}
function clearCache() {
  cache = [];
  setTimeout(() => clearCache(), 1000 * 60 * 10);
}

function jsDateToMySql(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}
