import KiwiiClient from '../struct/Client';
import Event from '../struct/Event';
import { Message, MessageEmbed, GuildMemberManager } from 'discord.js';
import { I18n } from 'i18n';
import * as path from 'path';
const i18n = new I18n();
i18n.configure({
    locales: ['en', 'fr', 'de'],
    directory: path.join(process.cwd(), 'locales'),
    defaultLocale: 'en',
    objectNotation: true,
});
i18n.setLocale('en');

export default class MessageEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'messageCreate',
            once: false,
        });
    }

    public override execute(message: Message): Promise<Message> | void {
        const { author } = message;
        const { bot } = author;
        if (!message.guild) {
            // I'm not sure if this is the best way to do this, but it works, and it's not too bad.
            Object.defineProperty(message, 'guild', {
                value: {
                    client: this.client,
                },
                writable: true,
            });
            // I'm sorry for this... But I don't know how else to do it. I'm sorry. I'm sorry. I'm sorry. I'm sorry. 
            Object.defineProperty(message, 'guild', {
                value: {
                    i18n,
                    //@ts-ignore: GuildMemberManager is private, and without it, it won't work, so we ignore it here for now (it's not a big deal) and we'll fix it later (I hope) 😔
                    members: new GuildMemberManager(message.guild),
                },
            });
        }
        let prefix = [this.client.prefix];
        if (message.guild?.prefix) prefix.push(message.guild.prefix);
        if ((bot || message.webhookId) && !this.client.config.discord.dev.debug)
            return;

        if (message.content.match(/n+o+\s+u+/gi))
            return message.channel.send('no u');
        if (message.content.match(/\(╯°□°\）╯︵ ┻━┻/g))
            return message.channel.send('┻━┻       (゜-゜)');
        // Check prefix
        let index;
        // Find which prefix are used
        for (let i = 0; i < prefix.length; i++) {
            if (message.content.toLowerCase().startsWith(prefix[i]!)) {
                index = i;
                break;
            } else {
                index = null;
                continue;
            }
        }
        if (
            message.content.startsWith(`<@!${this.client.user!.id}>`) &&
            message.content.endsWith(`<@!${this.client.user!.id}>`) &&
            message.guild &&
            message.channel.type !== 'DM'
        )
            return message.reply(
                message.guild!.i18n.__mf('MESSAGE_PREFIX.msg', {
                    prefix: message.guild.prefix,
                })
            );
        if (!prefix[index as number]) return;
        const args = message.content
            .slice(prefix[index as number]!.length)
            .trim()
            .split(/\s+/g);
        const command = args.shift()!.toLowerCase();
        if (
            !this.client.commands.has(command) &&
            !this.client.aliases.has(command)
        )
            return;
        const command_to_execute =
            this.client.commands.get(command) ||
            this.client.aliases.get(command);
        if (!command_to_execute) return;
        command_to_execute.setMessage(message);
        const reasons = this.client.utils.checkPermissions(
            message,
            command_to_execute
        );
        if (index === null || index === undefined) return;
        if (this.client.isOwner(author)) {
            try {
                command_to_execute.execute(this.client, message, args);
            } catch (error: any) {
                console.error(error);
                message.reply(
                    message.guild!.i18n.__mf('ERROR_MESSAGE.msg') + error.name
                );
            }
        } else {
            if (!message.content.toLowerCase().startsWith(prefix[index]!))
                return;

            if (reasons.length > 0) {
                const embed = new MessageEmbed()
                    .setAuthor(
                        message.client.user!.tag,
                        message.client.user!.displayAvatarURL({
                            dynamic: true,
                            format: 'png',
                            size: 2048,
                        })
                    )
                    .setColor('RED')
                    .setDescription(
                        `\`\`\`diff\n-${message.guild!.i18n.__mf(
                            'PERMS_MESSAGE.blocked_cmd'
                        )}\n\`\`\`\n\n` +
                            `\`${message.guild!.i18n.__mf(
                                'PERMS_MESSAGE.reason'
                            )}:\`\n\n${reasons
                                .map((reason) => '• ' + reason)
                                .join('\n')}`
                    );
                return message.channel.send({ embeds: [embed] });
            } else {
                try {
                    command_to_execute.execute(this.client, message, args);
                } catch (error: any) {
                    console.error(error);
                    message.reply(
                        message.guild!.i18n.__mf('ERROR_MESSAGE') + error.name
                    );
                }
            }
        }
    }
}
