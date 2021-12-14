import { createTranscript } from '../../util/Transcript';
import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';
import type { CommandInteraction, TextBasedChannels } from 'discord.js';

export default class Transcript extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'transcript',
            description: 'Generate a transcript of the current channel.',
            commandOptions: [
                {
                    name: 'channel',
                    description: 'The channel to generate the transcript from.',
                    type: 7,
                    required: false,
                },
                {
                    name: 'limit',
                    description:
                        'The number of messages to include in the transcript.',
                    type: 4,
                    required: false,
                },
            ],
        });
    }

    public override async execute(
        interaction: CommandInteraction,
        {
            channel,
            limit,
        }: { channel: TextBasedChannels | null; limit?: number }
    ) {
        if (!channel) channel = interaction.channel;
        if (channel?.type === 'GUILD_TEXT') {
            await interaction.deferReply();
            const transcript = await createTranscript(channel, { limit });
            interaction.editReply({ files: [transcript] });
        }
    }
}
