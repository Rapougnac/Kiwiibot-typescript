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

        if (interaction.commandName === 'ping') {
            const commandInteraction = this.client.slashs.get('ping');
            let args;
            if (commandInteraction?.commandOptions) {
                args = this.client.interactionManager.parseOptions(
                    interaction,
                    commandInteraction?.commandOptions
                );
            }
            commandInteraction?.execute(interaction, args);
        }
    }
}
