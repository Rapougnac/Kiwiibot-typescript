import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import piston from '../../struct/piston/piston';
import type { Message } from 'discord.js';
import { Util, MessageEmbed } from 'discord.js';

export default class RunCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'run',
            aliases: ['rn'],
            category: 'docs',
            description: 'Runs the command',
            utilisation: '{prefix}run <command>',
        });
    }

    public override async execute(_client: KiwiiClient, message: Message) {
        // Yeah, ik, that's incredibly beautiful. I'm so proud of myself.
        const content = message.content
            .replace(
                new RegExp(
                    `${this.client.prefix.replace('?', '\\?')} *${
                        this.help.name
                    }`
                ),
                ''
            )
            .trim();
        const runtime = piston();
        const runtimes = await runtime.runtimes();
        const [language, ...args] = content
            .split(/```(?:\w+|\w\+\+)?\n/g)
            .map((s) => s.replace(/\n```/g, ''));
        if (!language)
            return message.channel.send({
                content: `Please specify a language`,
                embeds: [
                    new MessageEmbed()
                        .setTitle('Avaliable languages:')
                        .setDescription(
                            `${runtimes
                                .map((r) => `\`${r.language}\``)
                                .join(', ')}`
                        ),
                ],
            });
        if (
            content.substring(language.length).startsWith('```') &&
            content.substring(language.length).endsWith('```')
        ) {
            const runtimeName =
                runtimes.find(
                    (r) => r.language === language.replace(/\n/, '')
                ) ||
                runtimes.find((r) =>
                    r.aliases.includes(language.replace(/\n/, ''))
                );
            const res = await runtime.execute(
                runtimeName?.language ?? language.replace(/\n/g, ''),
                args.join(' ')
            );
            if (res.message) {
                return await message.channel.send(
                    `[ERROR]\nThe result sended the following error: ${res.message}`
                );
            }
            if (res.run.stdout.length < 1900) {
                await message.channel.send({
                    content: `Here are your result ${message.author} \`(using ${
                        res.language
                    } - v${res.version})\`\n\`\`\`${res.language}\n${
                        res.run.stdout
                            ? res.run.stdout
                            : res.run.stderr
                            ? `[ERROR]\n${res.run.stderr}`
                            : 'Your code ran without an output'
                    }\n\`\`\``,

                    allowedMentions: {
                        repliedUser: true,
                    },
                });
            } else {
                const splittedRes = Util.splitMessage(res.run.stdout, {
                    maxLength: 1900,
                    char: '\n',
                });
                splittedRes.forEach(
                    (s, i) =>
                        void message.channel.send(
                            i !== 0
                                ? `\`\`\`${res.language}\n${s}\n\`\`\``
                                : `Here are your result ${message.author} \`(using ${res.language} - v${res.version})\`\n\`\`\`${res.language}\n${s}\n\`\`\``
                        )
                );
            }
        } else {
            return message.channel.send(
                `Please specify send your code and a code block, (e.g):\n\`\`\`${language}\n${args.join(
                    ' '
                )}\n\`\`\``
            );
        }
    }
}
