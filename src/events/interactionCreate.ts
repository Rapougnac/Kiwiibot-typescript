import Event from '../struct/Event';
import KiwiiClient from '../struct/Client';
import { Interaction, GuildMemberManager } from 'discord.js';
import { I18n } from 'i18n';
import * as path from 'path';
const i18n = new I18n();
i18n.configure({
    locales: ['en', 'fr', 'de'],
    directory: path.join(process.cwd(), 'locales'),
    defaultLocale: 'en',
    objectNotation: true,
});
i18n.setLocale('en');

export default class InteractionCreate extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'interactionCreate',
        });
    }
    public override async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        if (!this.client.slashs.has(interaction.commandName)) return;
        const commandInteraction = this.client.slashs.get(
            interaction.commandName
        );
        let args;
        if (commandInteraction?.commandOptions) {
            args = this.client.interactionManager.parseOptions(
                interaction,
                commandInteraction?.commandOptions
            );
        }
        if (!interaction.guild) {
            Object.defineProperty(interaction, 'guild', {
                value: {
                    client: this.client,
                },
                writable: true,
            });

            Object.defineProperty(interaction, 'guild', {
                value: {
                    i18n,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Same error in the messageCreate event
                    members: new GuildMemberManager(interaction.guild),
                },
            });
        }
        if (!args) {
            try {
                commandInteraction?.execute(interaction);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                // eslint-disable-next-line no-console
                console.error(
                    `Error from command: ${interaction.commandName}: ${e.message}\n${e.stack}`
                );
                return interaction.reply({
                    content: 'Sorry, there was an error executing that command',
                    ephemeral: true,
                });
            }
        }
        try {
            commandInteraction?.execute(interaction, args);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            // eslint-disable-next-line no-console
            console.error(
                `Error from command: ${interaction.commandName}: ${e.message}\n${e.stack}`
            );
            return interaction.reply({
                content: 'Sorry, there was an error executing that command',
                ephemeral: true,
            });
        }
    }
}
