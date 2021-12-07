import LanguageSchema from '../../models/languageSchema';
import { Message } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
import mongoose from 'mongoose';

export default class SetLangCommand extends Command {
    constructor(client: Client) {
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

    public async execute(
        _client: Client,
        message: Message,
        [language]: string[]
    ) {
        if (!mongoose.connection._hasOpened)
            return await message.channel.send(
                message.guild?.i18n.__mf('setlanguage.no_conn') ??
                    'No connection'
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

            message.guild.i18n.setLocale(targetedlanguage);

            await LanguageSchema.findOneAndUpdate(
                {
                    _id: message.guild.id,
                },
                {
                    _id: message.guild.id,
                    language: targetedlanguage,
                },
                {
                    upsert: true,
                }
            ).then(async () => {
                return await message.reply(
                    message.guild?.i18n.__mf('setlanguage.set_language') ?? ''
                );
            });
        } else {
            return message.channel.send(
                "You can't set a language inside dms, the default langage is `english`"
            );
        }
    }
}
