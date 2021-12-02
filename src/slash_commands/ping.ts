import SlashCommand from '../struct/SlashCommand';
// import { SlashCommandBuilder } from '@discordjs/builders';
import KiwiiClient from '../struct/Client';
// const command = new SlashCommandBuilder();

export default class Ping extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ping',
            description: 'Ping',
            commandOptions: [
                {
                    name: 'paf',
                    description: 'Paf',
                    type: 3,
                },
                {
                    name: 'member',
                    description: 'Member',
                    type: 6,
                }
            ],
        });
    }

    public execute(interaction: any): void {
        interaction.reply('Pong');
    }
}
