import SlashCommand from '../../struct/SlashCommand';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';
import KiwiiClient from '../../struct/Client';
import { textTruncate, clean } from '../../util/string';
import util from 'util';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';

export default class EvalSlashCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'eval',
            description: 'Evaluates some JavaScript code',
            global: false,
            commandOptions: [
                {
                    name: 'code',
                    description: 'The code to evaluate',
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async execute(
        interaction: CommandInteraction,
        client: KiwiiClient,
        { code }: { code: string }
    ): Promise<string | void> {
        if (!this.client.isOwner(interaction.user))
            return interaction.send('This command is limited to devs!', {
                ephemeral: true,
            });
        let res = eval(code);
        if (typeof res !== 'string') res = util.inspect(res);
        const message = await interaction.defer({ fetchReply: true });
        if (!message) return;
        message.channel.send(clean(res), { split: true, code: 'js' });
        interaction.edit("Here's the result of your evaluation");
    }
}
