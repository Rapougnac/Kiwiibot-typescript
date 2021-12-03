import Event from '../struct/Event';
import KiwiiClient from '../struct/Client';
import { Interaction } from 'discord.js';

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
        try {
            commandInteraction?.execute(interaction, args);
        } catch (e: any) {
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
