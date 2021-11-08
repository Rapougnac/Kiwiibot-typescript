import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class UptimeCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'uptime',
            aliases: ['up'],
            description: 'Get the uptime of the bot',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}uptime',
            img: 'https://image.flaticon.com/icons/png/512/4400/4400331.png',
        });
    }
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async execute(client: Client, message: Message, args: string[]) {
        const { days, hours, minutes, seconds } = this.client.utils.parseMs(
            client.uptime ?? 0
        );
        message.reply(
            message.guild!.i18n.__mf('uptime.msg', {
                days,
                hours,
                minutes,
                seconds,
            })
        );
    }
}
