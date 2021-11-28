import _ from 'lodash';
import {
    joinArray,
    translatePermissions,
    upperFirstButAcceptEmojis,
    beautifyCategories,
} from '../../util/string';
import { Message, MessageEmbed } from 'discord.js';
import KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';
import didYouMean from 'didyoumean2';
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
            img: 'https://image.flaticon.com/icons/png/512/4196/4196369.png',
        });
    }
    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<void | Message | string> {
        if (!message.guild) return;
        if (args.length > 2) return;
        const fields: {
            name: string;
            value: string;
            inline?: boolean;
        }[] = [];
        if (message.channel.type === 'GUILD_TEXT' && message.channel.nsfw) {
            for (const category of [...this.client.categories]) {
                const ct = beautifyCategories(category);
                fields.push({
                    name: this.client.commands.filter(
                        (c) => c.help.category === category && !c.config.hidden
                    ).size
                        ? `${upperFirstButAcceptEmojis(ct)} [${
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
                        message.guild.i18n.getLocale()
                    ),
                    inline: false,
                });
            }
        } else {
            for (const category of [...this.client.categories].remove('nsfw')) {
                const ct = beautifyCategories(category, true);

                fields.push({
                    name: `${
                        this.client.commands.filter(
                            (c) =>
                                c.help.category === category &&
                                !c.config.hidden &&
                                !c.config.nsfw
                        ).size
                            ? upperFirstButAcceptEmojis(ct) +
                              ' ' +
                              '[' +
                              this.client.commands.filter(
                                  (c) =>
                                      c.help.category === category &&
                                      !c.config.hidden &&
                                      !c.config.nsfw
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
                                        !cmd.config.hidden &&
                                        !cmd.config.nsfw
                                )
                                .map((value) => `\`${value.help.name}\``),
                        ],
                        message.guild.i18n.getLocale()
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
            // If a field is empty delete it
            for (let i = 0; i < fields.length; i++) {
                if (
                    !(
                        (fields[i]?.name && fields[i]?.value) ||
                        fields[i]?.name ||
                        fields[i]?.value
                    )
                ) {
                    delete fields[i];
                }
            }
        }
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setTitle(message.guild.i18n.__mf('help.title'))
                .addFields(fields.sort((a, b) => a.name.localeCompare(b.name)))
                .setColor('ORANGE')
                .setTimestamp()
                .setFooter(
                    message.channel.type === 'GUILD_TEXT'
                        ? message.channel.nsfw
                            ? message.guild.i18n.__mf(`help.cmd_usage`, {
                                  prefix: client.prefix,
                              }) +
                              message.guild.i18n.__mf('help.nsfw_message', {
                                  prefix: client.prefix,
                              })
                            : message.guild.i18n.__mf('help.cmd_usage', {
                                  prefix: client.prefix,
                              })
                        : ''
                );
            if (this.help.img) embed.setThumbnail(this.help.img);
            message.channel.send({ embeds: [embed] });
        } else {
            const command =
                this.client.commands.get(args.join(' ').toLowerCase()) ||
                this.client.aliases.get(args.join(' ').toLowerCase());
            const possibleCommand = didYouMean(args.join(' '), [
                ...this.client.commands.keys(),
            ]);
            let possibleCommandAlias: string | null = null;
            if (!possibleCommand)
                possibleCommandAlias = didYouMean(args.join(' '), [
                    ...this.client.aliases.keys(),
                ]);
            if (
                !command &&
                Boolean(
                    possibleCommand ? possibleCommand : possibleCommandAlias
                )
            ) {
                const notFoudDym = message!.guild.i18n.__mf(
                    'help.not_found_dym',
                    {
                        command: possibleCommand
                            ? possibleCommand
                            : possibleCommandAlias,
                    }
                );
                return message.channel.send(
                    `${client.emotes.error} - ${notFoudDym}`
                );
            } else if (!command)
                return message.channel.send(
                    `${client.emotes.error} - ${message!.guild.i18n.__mf(
                        'help.not_found'
                    )}`
                );
            if (command.config.hidden) {
                return message.channel.send(
                    `${client.emotes.error} - ${message.guild.i18n.__mf(
                        'help.not_found'
                    )}`
                );
            }
            if (
                command.config.nsfw &&
                message.channel.type === 'GUILD_TEXT' &&
                !message.channel.nsfw
            ) {
                return message.channel.send(
                    `${client.emotes.error} - ${message.guild.i18n.__mf(
                        'help.nsfw'
                    )}`
                );
            }

            let description = message.guild.i18n.__mf(
                `${command.help.name}.description`
            );
            if (
                description === `${command.help.name}.description` ||
                !description
            ) {
                description =
                    command.help.description ||
                    message.guild.i18n.__mf('help.no_desc');
            }
            const embed = new MessageEmbed()
                .setColor('ORANGE')
                .setAuthor(message.guild.i18n.__mf('help.title'))
                .addFields(
                    {
                        name: message.guild.i18n.__mf('help.name'),
                        value: command.help.name,
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.category'),
                        value: _.upperFirst(command.help.category),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__n('help.alias', command.config.aliases.length),
                        value:
                            command.config.aliases.length < 1
                                ? message.guild.i18n.__mf('help.none_alias')
                                : command.config.aliases.join('\n'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.usage'),
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
                              } ${message.guild.i18n.__mf('help.seconds')}`
                            : message.guild.i18n.__mf('help.none_cooldown'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.guild_only'),
                        value: command.config.guildOnly
                            ? message.guild.i18n.__mf('common.yes')
                            : message.guild.i18n.__mf('common.no'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.admin_only'),
                        value: command.config.adminOnly
                            ? message.guild.i18n.__mf('common.yes')
                            : message.guild.i18n.__mf('common.no'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.owner_only'),
                        value: command.config.ownerOnly
                            ? message.guild.i18n.__mf('common.yes')
                            : message.guild.i18n.__mf('common.no'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.user_permissions'),
                        value:
                            command.config.permissions.length === 0
                                ? message.guild.i18n.__mf('help.no_permissions')
                                : translatePermissions(
                                      command.config.permissions,
                                      message.guild.i18n.getLocale()
                                  )
                                      .map((x) => {
                                          x = x
                                              .toLowerCase()
                                              .replace(/(^|"|_)(\S)/g, (z) =>
                                                  z.toUpperCase()
                                              )
                                              .replace(/_/g, ' ');
                                          if (x.match(/Use Vad/g))
                                              x.replace(
                                                  /Use Vad/g,
                                                  'Use Voice Activity'
                                              );
                                          if (x.match(/Guild/g))
                                              x.replace(/Guild/g, 'Server');
                                          return x;
                                      })
                                      .join('\n'),
                        inline: true,
                    },
                    {
                        name: message.guild.i18n.__mf('help.bot_permissions'),
                        value:
                            command.config.clientPermissions.length === 0
                                ? message.guild.i18n.__mf('help.no_permissions')
                                : translatePermissions(
                                      command.config.clientPermissions,
                                      message.guild.i18n.getLocale()
                                  )
                                      .map((x) => {
                                          x = x
                                              .toLowerCase()
                                              .replace(/(^|"|_)(\S)/g, (z) =>
                                                  z.toUpperCase()
                                              )
                                              .replace(/_/g, ' ')
                                              .replace(
                                                  /Use Vad/g,
                                                  'Use Voice Activity'
                                              )
                                              .replace(/Guild/g, 'Server');
                                          return x;
                                      })
                                      .join('\n'),
                        inline: true,
                    },
                    {
                        name: 'Description',
                        value: description,
                        inline: false,
                    }
                )
                .setTimestamp()
                .setDescription(message.guild.i18n.__mf('help.information'));
            if (command.help.img) embed.setThumbnail(command.help.img);
            await message.channel.send({ embeds: [embed] });
        }
    }
}
