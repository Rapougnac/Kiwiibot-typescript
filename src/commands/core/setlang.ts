import PrefixSchema from '../../models/languageSchema';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class SetLangCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'setlanguage',
            aliases: ['setlang'],
            description: 'Set the language of the bot',
            category: 'core',
            cooldown: 5,
            utilisation: '{prefix}setlang [language]',
            permissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            ownerOnly: true,
            img: 'https://image.flaticon.com/icons/png/512/1940/1940634.png',
        });
    }

    public async execute(
        client: Client,
        message: Message,
        [language]: string[]
    ) {
        if (message.guild) {
            let targetedlanguage = language.toLowerCase();
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

            await PrefixSchema.findOneAndUpdate(
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
                return await message.inlineReply(
                    message.guild!.i18n.__mf('setlanguage.set_language'),
                    {
                        allowedMentions: {
                            repliedUser: false,
                        },
                    }
                );
            });
        } else {
            return message.channel.send(
                "You can't set a language inside dms, the default langage is `english`"
            );
        }
    }
}
