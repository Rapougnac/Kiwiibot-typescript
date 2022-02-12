import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import type { Message } from 'discord.js';

export default class SetLangCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'setlanguage',
      aliases: ['setlang'],
      description: 'Set the language of the bot',
      category: 'core',
      cooldown: 5,
      utilisation: '{prefix}setlang [language]',
      permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      guildOnly: true,
      img: 'https://image.flaticon.com/icons/png/512/1940/1940634.png',
    });
  }
  public override async execute(
    _client: KiwiiClient,
    message: Message,
    [language]: string[]
  ) {
    if (!this.client.mySql.connected)
      return await message.channel.send(
        message.guild?.i18n.__mf('prefix-reset.no_conn') ??
          'No connection to the database.'
      );
    if (message.guild && message.guild.available) {
      let targetedlanguage = language?.toLowerCase() ?? 'en';
      if (targetedlanguage.includes('french')) targetedlanguage = 'fr';
      else if (targetedlanguage.includes('english')) targetedlanguage = 'en';
      if (!message.guild.i18n.getLocales().includes(targetedlanguage)) {
        return await message.channel.send(
          message.guild.i18n.__mf('setlanguage.not_supported_language')
        );
      }

      message.guild.i18n.setLocale(targetedlanguage);

      await this.client.mySql.connection
        .execute(
          'INSERT INTO `guildsettings` (`guildId`, `language`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `language` = ?',
          [message.guild.id, targetedlanguage, targetedlanguage]
        )
        .then(
          async () =>
            await message.reply(
              message.guild?.i18n.__mf('setlanguage.set_language') as string
            )
        );
    } else {
      return await message.channel.send(
        "You can't set a language inside dms, the default langage is `english`"
      );
    }
  }
}
