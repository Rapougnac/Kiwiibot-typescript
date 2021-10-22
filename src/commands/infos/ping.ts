import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { Message } from 'discord.js';
import { separateNumbers } from '../../util/string';

export default class PingCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'ping',
            aliases: ['pouing'],
            description: 'Send a round trip if you\'re bored.',
            category: 'infos',
            utilisation: '{prefix}ping',
            img: 'https://cdn-icons-png.flaticon.com/512/3883/3883802.png',
        });
    }

    public async execute(client: KiwiiClient, message: Message, args: string[]) {
        message.channel.startTyping();
        const msg = await message.inlineReply(`🏓 Pinging....`, {
            allowedMentions: {
                repliedUser: false,
            },
        });
        const ping = msg.createdTimestamp - message.createdTimestamp;

        const string = message.guild!.i18n.__mf('ping.msg', {
            pong: 'o'.repeat(Math.min(Math.round(ping / 100), 1500)),
            ping: ping,
            heartbeat: separateNumbers(client.ws.ping, message.guild?.i18n.getLocale()),
        });
        msg.edit(string, {
            allowedMentions: {
                repliedUser: false,
            }
        });
        message.channel.stopTyping();
    }
}