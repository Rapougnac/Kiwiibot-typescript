import { exec } from 'child_process';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';
import SlashCommand from '../../struct/SlashCommand';
import Client from '../../struct/Client';
export default class SlashCmd extends SlashCommand {
    constructor(client: Client) {
        super(client, {
            name: 'exec',
            description: 'Execute commands in shell',
            global: false,
            commandOptions: [
                {
                    name: 'command',
                    description: 'The command to execute',
                    type: 3,
                    required: true,
                },
            ],
        });
    }
    public async execute(
        interaction: CommandInteraction,
        client: Client,
        { command }: { command: string }
    ) {
        if (!this.client.isOwner(interaction.user))
            return interaction.send('This command is limited to devs only!', {
                ephemeral: true,
            });
        try {
            exec(command, async (err, stdout) => {
                let res = stdout || err;
                const message = await interaction.defer({ fetchReply: true });
                if (!message) return;
                message.channel.send(res, { split: true, code: 'js' });
                interaction.edit("­Here's the execution result!");
            });
        } catch (e) {
            interaction.send(`\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``);
        }
    }
}
