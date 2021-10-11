import _ from 'lodash';
import { joinArray } from '../../util/string';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';
import { clientMap } from '../../../config';
import { Guild } from '../../struct/interfaces/Guild';

export default class HelpCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'help',
            aliases: ['h'],
            description: 'Get the help command',
            category: 'core',
            cooldown: 5,
            utilisation: '{prefix}help <command-name>',
            clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
        });
    }
    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<void | Message> {
        if (!message.guild) return;
        if (args.length > 2) return;
        const fields = [];
        if (message.channel.type === 'text' && message.channel.nsfw) {
            for (const category of [...this.client.categories]) {
                fields.push({
                    name: this.client.commands.filter(
                        (c) => c.help.category === category && !c.config.hidden
                    ).size
                        ? `${_.upperFirst(category.replace(/-/g, ' '))} [${
                              this.client.commands.filter(
                                  (c) =>
                                      c.help.category === category &&
                                      !c.config.hidden
                              ).size
                          }]`
                        : '',
                    value: joinArray(
                        [
                            ...this.client.commands
                                .filter(
                                    (cmd) =>
                                        cmd.help.category === category &&
                                        !cmd.config.hidden
                                )
                                .map((value) => `\`${value.help.name}\``),
                        ],
                        (message.guild as unknown as Guild).i18n.getLocale()
                    ),
                    inline: false,
                });
            }
        } else {
            //@ts-ignoreF
            for (const category of [...client.categories].remove('nsfw')) {
                fields.push({
                    name: `${
                        this.client.commands.filter(
                            (c) =>
                                c.help.category === category && !c.config.hidden
                        ).size
                            ? _.upperFirst(category.replace(/-/g, ' ')) +
                              ' ' +
                              '[' +
                              this.client.commands.filter(
                                  (c) =>
                                      c.help.category === category &&
                                      !c.config.hidden
                              ).size +
                              ']'
                            : ''
                    }`,
                    value: joinArray(
                        [
                            ...this.client.commands
                                .filter(
                                    (cmd) =>
                                        cmd.help.category === category &&
                                        !cmd.config.hidden
                                )
                                .map((value) => `\`${value.help.name}\``),
                        ],
                        (message.guild as unknown as Guild).i18n.getLocale()
                    ),
                    inline: false,
                });
            }
        }
        if (
            fields.some(
                (x) => (x.name && x.value) || x.name || x.value === null || ''
            )
        ) {
            for (let i = 0; i < fields.length; i++) {
                if (
                    !(
                        (fields[i].name && fields[i].value) ||
                        fields[i].name ||
                        fields[i].value
                    )
                ) {
                    delete fields[i];
                }
            }
        }
        if (!args[0]) {
            const embed = new MessageEmbed()
                .addFields(fields.sort((a, b) => a.name.localeCompare(b.name)))
                .setColor('ORANGE')
                .setTimestamp()
                .setFooter(
                    (message.guild as unknown as Guild).i18n.__mf(`help.cmd_usage`, {
                        prefix: client.prefix,
                    })
                );

            message.channel.send(embed);
        } else {
            const command =
                this.client.commands.get(args.join(' ').toLowerCase()) ||
                this.client.aliases.get(args.join(' ').toLowerCase());
            if (!command)
                return message.channel.send(
                    `\\${client.emotes.error} - ${(message.guild as  unknown as Guild).i18n.__mf(
                        'help.not_found'
                    )}`
                );
            if (command.config.hidden) {
                return message.channel.send(
                    `${client.emotes.error} - ${(message.guild as unknown as Guild).i18n.__mf(
                        'help.not_found'
                    )}`
                );
            }
            if (
                command.config.nsfw &&
                message.channel.type === 'text' &&
                !message.channel.nsfw
            ) {
                return message.channel.send(
                    `${client.emotes.error} - ${(message.guild as unknown as Guild).i18n.__mf(
                        'help.nsfw'
                    )}`
                );
            }

            const description = (message.guild as unknown as Guild).i18n.__mf(
                `${command.help.name}.description`
            );
            await message.channel.send({
                embed: {
                    color: 'ORANGE',
                    author: { name: (message.guild as unknown as Guild).i18n.__mf('help.title') },
                    fields: [
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.name'),
                            value: command.help.name,
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.category'),
                            value: _.upperFirst(command.help.category),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.alias'),
                            value:
                                command.config.aliases.length < 1
                                    ? (message.guild as unknown as Guild).i18n.__mf(
                                          'help.none_alias'
                                      )
                                    : command.config.aliases.join('\n'),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.usage'),
                            value: command.help.utilisation!.replace(
                                '{prefix}',
                                client.prefix
                            ),
                            inline: true,
                        },
                        {
                            name: 'Cooldown',
                            value: command.config.cooldown
                                ? `${
                                      command.config.cooldown
                                  } ${(message.guild as unknown as Guild).i18n.__mf('help.seconds')}`
                                : (message.guild as unknown as Guild).i18n.__mf(
                                      'help.none_cooldown'
                                  ),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.guild_only'),
                            value: command.config.guildOnly
                                ? (message.guild as unknown as Guild).i18n.__mf('common.yes')
                                : (message.guild as unknown as Guild).i18n.__mf('common.no'),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.admin_only'),
                            value: command.config.adminOnly
                                ? (message.guild as unknown as Guild).i18n.__mf('common.yes')
                                : (message.guild as unknown as Guild).i18n.__mf('common.no'),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf('help.owner_only'),
                            value: command.config.ownerOnly
                                ? (message.guild as unknown as Guild).i18n.__mf('common.yes')
                                : (message.guild as unknown as Guild).i18n.__mf('common.no'),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf(
                                'help.user_permissions'
                            ),
                            value:
                                command.config.permissions.length === 0
                                    ? (message.guild as unknown as Guild).i18n.__mf(
                                          'help.no_permissions'
                                      )
                                    : command.config.permissions.map((x) =>
                                          x
                                              .toLowerCase()
                                              .replace(/(^|"|_)(\S)/g, (z) =>
                                                  z.toUpperCase()
                                              )
                                              .replace(/_/g, ' ')
                                              .replace(
                                                  /Use Vad/g,
                                                  'Use Voice Activity'
                                              )
                                              .replace(/Guild/g, 'Server')
                                      ),
                            inline: true,
                        },
                        {
                            name: (message.guild as unknown as Guild).i18n.__mf(
                                'help.bot_permissions'
                            ),
                            value:
                                command.config.clientPermissions.length === 0
                                    ? (message.guild as unknown as Guild).i18n.__mf(
                                          'help.no_permissions'
                                      )
                                    : command.config.clientPermissions.map(
                                          (x) =>
                                              x
                                                  .toLowerCase()
                                                  .replace(
                                                      /(^|"|_)(\S)/g,
                                                      (z) => z.toUpperCase()
                                                  )
                                                  .replace(/_/g, ' ')
                                                  .replace(
                                                      /Use Vad/g,
                                                      'Use Voice Activity'
                                                  )
                                                  .replace(/Guild/g, 'Server')
                                      ),
                            inline: true,
                        },
                        {
                            name: 'Description',
                            value: description,
                            inline: false,
                        },
                    ],
                    timestamp: new Date(),
                    description: (message.guild as unknown as Guild).i18n.__mf('help.information'),
                },
            });
        }
    }
}
