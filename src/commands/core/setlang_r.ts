import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { Message } from 'discord.js';

export default class SetLangCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'setlangr',
            aliases: [],
            description: '',
            category: '',
            utilisation: '{prefix}',
        });
    }
    public override async execute(
        client: KiwiiClient,
        message: Message,
        [language]: string[]
    ) {
        if (!this.client.mySql.connection)
            return await message.channel.send(
                message.guild?.i18n.__mf('prefix-reset.no_conn') ??
                    'No connection to the database.'
            );
        if (message.guild && message.guild.available) {
            let targetedlanguage = language?.toLowerCase() ?? 'en';
            if (targetedlanguage.includes('french')) targetedlanguage = 'fr';
            else if (targetedlanguage.includes('english'))
                targetedlanguage = 'en';
            if (!message.guild.i18n.getLocales().includes(targetedlanguage)) {
                return await message.channel.send(
                    message.guild.i18n.__mf(
                        'setlanguage.not_supported_language'
                    )
                );
            }

            void message.guild.i18n.setLocale(targetedlanguage);

            await this.client.mySql.connection.execute(
                'INSERT INTO `guildSettings` (`guildId`, `language`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `language` = ?',
                [message.guild.id, targetedlanguage, targetedlanguage]
            );
        }
    }
}
