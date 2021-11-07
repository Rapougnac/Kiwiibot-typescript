import KiwiiClient from '../../struct/Client';
import SlashCommand from '../../struct/SlashCommand';
import languageSchema from '../../models/languageSchema';
import { Message } from 'discord.js';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';

export default class SetLangSlashCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'setlang',
            description: 'Change the language of the bot',
            commandOptions: [
                {
                    name: 'language',
                    description: 'The language to set the bot to',
                    type: 3,
                    required: true,
                },
            ],
            global: false,
        });
    }
    public async execute(
        interaction: CommandInteraction,
        client: KiwiiClient,
        { language }: { language: string }
    ): Promise<void | string> {
        if (!interaction.inGuild())
            return interaction.send(
                'You must be in a guild to use this command'
            );
        language = language.toLowerCase();
        if (language.includes('french')) language = 'fr';
        else if (language.includes('english')) language = 'en';

        if (!interaction.guild!.i18n.getLocales().includes(language))
            return interaction.send(
                interaction.guild?.i18n.__mf(
                    'setlanguage.not_supported_language'
                )
            );
        interaction.guild!.i18n.setLocale(language);

        await languageSchema
            .findOneAndUpdate(
                { _id: interaction.guild!.id },
                { _id: interaction.guild!.id, language },
                { upsert: true }
            )
            .then(
                async () =>
                    await interaction.send(
                        interaction.guild?.i18n.__mf('setlanguage.set_language')
                    )
            );
    }
}
