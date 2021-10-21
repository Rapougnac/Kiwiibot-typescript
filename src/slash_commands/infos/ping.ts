import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';
import SlashCommand from '../../struct/SlashCommand';
import KiwiiClient from '../../struct/Client';

export default class PingSlashCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ping',
            description: 'Just a simple ping command',
        });
    }

    public async execute(
        interaction: CommandInteraction,
        client: KiwiiClient,
        args: any
    ) {
        if (interaction.guild) {
            const message = await interaction.defer({ fetchReply: true });
            if (!message) return;
            const ping =
                message.createdTimestamp - interaction.createdTimestamp;
            const str = message.guild!.i18n.__mf('ping.msg', {
                pong: 'o'.repeat(Math.min(Math.round(ping / 100), 1500)),
                ping: ping,
                heartbeat: this.client.ws.ping,
            });
            interaction.edit(str);
        } else {
            const message = await interaction.defer({ fetchReply: true });
            if (!message) return;
            const ping =
                message.createdTimestamp - interaction.createdTimestamp;
            const str = await interaction.send(
                `🏓 P${'o'.repeat(
                    Math.min(Math.round(ping / 100), 1500)
                )}ng! The ping is: \`${ping}ms\`\n\`Hearthbeat${
                    this.client.ws.ping
                }ms`
            );
            interaction.edit(str);
        }
    }
}
