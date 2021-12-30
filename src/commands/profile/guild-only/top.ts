import Command from '../../../struct/Command';
import type KiwiiClient from '../../../struct/Client';
import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { ordinalize } from '../../../util/string';

export default class TopCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'top',
      description: 'Get the top 10 users of the server',
      category: 'profile',
      utilisation: '{prefix}top',
      guildOnly: true,
    });
  }

  public override async execute(
    _: KiwiiClient,
    msg: Message
  ): Promise<void | Message> {
    if (!msg.guild) return;
    let [thanks] = (await this.client.mySql.connection.query(
      'SELECT thanks, id FROM usersettings'
    )) as unknown as [
      {
        thanks: number | null;
        id: string;
      }[]
    ];
    if (!thanks.length) return;
    thanks = thanks.sort((a, b) => Number(b.thanks) - Number(a.thanks));
    let str = '';
    for (const [i, thank] of thanks.entries()) {
      if (thank.thanks === null) continue;
      const user = this.client.users.resolve(thank.id);
      const { thanks: thanksCount } = thank;
      const thanksStr = msg.guild.i18n.translatePlural(
        'top.thanks_count',
        thanksCount
      );
      const translated = msg.guild.i18n.__mf('top.list', {
        count: ordinalize(i + 1, msg.guild.i18n.getLocale() as 'en' | 'fr'),
        author: user?.username,
        thanks: thanksCount,
        thanksCount: thanksStr,
      });
      str += `${translated} \n\n`;
    }
    if (!str) return msg.channel.send(msg.guild.i18n.translate('top.noThanks'));
    const embed = new MessageEmbed()
      .setTitle(msg.guild.i18n.translate('top.topList'))
      .setDescription(str);
    await msg.channel.send({ embeds: [embed] });
  }
}
