import _ from 'lodash';
import {
    joinArray,
    translatePermissions,
    upperFirstButAcceptEmojis,
} from '../../util/string';
import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';
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
        const fields = [];
        if (message.channel.type === 'text' && message.channel.nsfw) {
            let ct: string = '';
            for (const category of [...this.client.categories]) {
                switch (category) {
                    case 'auto': {
                        ct = '🤖 auto';
                        break;
                    }
                    case 'anime': {
                        ct = '🎥 anime';
                        break;
                    }
                    case 'core': {
                        ct = '⚙ Core';
                        break;
                    }
                    case 'docs': {
                        ct = '📖 docs';
                        break;
                    }
                    case 'image-manipulation': {
                        ct = '🖼 image-manipulation';
                        break;
                    }
                    case 'edit-images': {
                        ct = '✏ edit-images';
                        break;
                    }
                    case 'infos': {
                        ct = 'ℹ infos';
                        break;
                    }
                    case 'interactions': {
                        ct = '👋 interactions';
                        break;
                    }
                    case 'owner': {
                        ct = '⛔ owner';
                        break;
                    }
                    case 'nsfw': {
                        ct = '🔞 nsfw';
                        break;
                    }
                }
                fields.push({
                    name: this.client.commands.filter(
                        (c) => c.help.category === category && !c.config.hidden
                    ).size
                        ? `${upperFirstButAcceptEmojis(
                              ct.replace(/-/g, ' ')
                          )} [${
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
            let ct: string = '';
            for (const category of [...this.client.categories].remove('nsfw')) {
                switch (category) {
                    case 'auto': {
                        ct = '🤖 auto';
                        break;
                    }
                    case 'anime': {
                        ct = '🎥 anime';
                        break;
                    }
                    case 'core': {
                        ct = '⚙ Core';
                        break;
                    }
                    case 'docs': {
                        ct = '📖 docs';
                        break;
                    }
                    case 'image-manipulation': {
                        ct = '🖼 image-manipulation';
                        break;
                    }
                    case 'edit-images': {
                        ct = '✏ edit-images';
                        break;
                    }
                    case 'infos': {
                        ct = 'ℹ infos';
                        break;
                    }
                    case 'interactions': {
                        ct = '👋 interactions';
                        break;
                    }
                    case 'owner': {
                        ct = '⛔ owner';
                        break;
                    }
                    case 'nsfw': {
                        ct = '🔞 nsfw';
                        break;
                    }
                }
                fields.push({
                    name: `${
                        this.client.commands.filter(
                            (c) =>
                                c.help.category === category && !c.config.hidden
                        ).size
                            ? upperFirstButAcceptEmojis(
                                  ct.replace(/-/g, ' ')
                              ) +
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
                // If the channel is not nsfw, set a message on the footer
                .setFooter(
                    message.channel.type === 'text'
                        ? !message.channel.nsfw
                            ? message.guild.i18n.__mf(`help.cmd_usage`, {
                                  prefix: client.prefix,
                              }) +
                              message.guild.i18n.__mf('help.nsfw_message', {
                                  prefix: client.prefix,
                              })
                            : message.guild.i18n.__mf('help.cmd_usage', {
                                  prefix: client.prefix,
                              })
                        : null
                );
            if (this.help.img) embed.setThumbnail(this.help.img);
            message.channel.send(embed);
        } else {
            const command =
                this.client.commands.get(args.join(' ').toLowerCase()) ||
                this.client.aliases.get(args.join(' ').toLowerCase());
            if (!command)
                return message.channel.send(
                    `\\${client.emotes.error} - ${message.guild.i18n.__mf(
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
                message.channel.type === 'text' &&
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
                    command.help.description ??
                    message.guild.i18n.__mf('help.no_desc');
            }
            const embed = new MessageEmbed({
                color: 'ORANGE',
                author: { name: message.guild.i18n.__mf('help.title') },
                fields: [
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
                        name: message.guild.i18n.__mf('help.alias'),
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
                                  ).map((x) => {
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
                                  }),
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
                                  ).map((x) => {
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
                                  }),
                        inline: true,
                    },
                    {
                        name: 'Description',
                        value: description,
                        inline: false,
                    },
                ],
                timestamp: new Date(),
                description: message.guild.i18n.__mf('help.information'),
            });
            if (command.help.img) embed.setThumbnail(command.help.img);
            await message.channel.send(embed);
        }
    }
}
