import KiwiiClient from '../struct/Client';
import Event from '../struct/Event';
import Command from '../struct/Command';
import { Message, MessageEmbed } from 'discord.js';

export default class MessageEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'message',
            once: false,
        });
    }

    public execute(message: Message): Promise<Message> | void {
        const { author, guild } = message;
        const { bot } = author;
        if (!guild) return;
        let prefix = [this.client.prefix, message.guild!.prefix];
        if (bot || message.webhookID) return;

        if (message.content.match(/n+o+ +u+/gi))
            return message.channel.send('no u');
        if (message.content.match(/\(╯°□°）╯︵ ┻━┻/g))
            return message.channel.send('┻━┻       (゜-゜)');
        // Check prefix
        let index: number = 0;
        // Find which prefix are used
        for (let i = 0; i < prefix.length; i++) {
            if (message.content.toLowerCase().startsWith(prefix[i])) {
                index = i;
                break;
            } else continue;
        }
        if (
            message.content.startsWith(`<@!${this.client.user!.id}>`) &&
            message.content.endsWith(`<@!${this.client.user!.id}>`) &&
            guild
        )
            return message.inlineReply(
                message.guild!.i18n.__mf('MESSAGE_PREFIX.msg', {
                    prefix: message.guild!.prefix,
                })
            );
        if (!prefix[index as number]) return;
        const args = message.content
            .slice(prefix[index as number].length)
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
            if (
                !message.content
                    .toLowerCase()
                    .startsWith(prefix[index as number])
            )
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
                return message.channel.send(embed);
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
