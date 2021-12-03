import SlashCommand from '../../struct/SlashCommand';
import KiwiiClient from '../../struct/Client';
import { CommandInteraction, Message } from 'discord.js';

export default class PingCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ping',
            description: 'Get the rountrip and the api latency of the bot',
        });
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        if (interaction.guild) {
            const message = await interaction.deferReply({ fetchReply: true });
            if (!(message instanceof Message)) return;
            const ping =
                message.createdTimestamp - interaction.createdTimestamp;
            const reply = message.guild!.i18n.__mf('ping.msg', {
                pong: 'o'.repeat(Math.min(Math.round(ping / 100), 1500)),
                ping,
                heartbeat: this.client.ws.ping,
            });
            interaction.editReply(reply);
        }
    }
}
