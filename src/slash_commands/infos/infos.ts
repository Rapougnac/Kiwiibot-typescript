import { MessageEmbed, User, Role, CommandInteraction } from 'discord.js';
import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';
import {
    convertUFB,
    trimArray,
    joinArray,
    translatePermissions,
} from '../../util/string';
import moment from 'moment';

export default class InfosCommand extends SlashCommand {
    public constructor(public client: KiwiiClient) {
        super(client, {
            name: 'info',
            description: 'Get informations about a user, role or the server',
            commandOptions: [
                {
                    name: 'user',
                    description:
                        'Get informations about you, or the specified user',
                    type: 1,
                    options: [
                        {
                            name: 'target',
                            description: 'The user to display',
                            type: 6,
                        },
                    ],
                },
                {
                    name: 'server',
                    description: 'Get informations about the server',
                    type: 1,
                },
                {
                    name: 'role',
                    description: 'Get informations about the specified role',
                    type: 1,
                    options: [
                        {
                            name: 'role',
                            description: 'The role to display',
                            type: 8,
                            required: true,
                        },
                    ],
                },
            ],
        });
    }

    public override async execute(
        interaction: CommandInteraction,
        {
            subcommand,
            user,
            role: _role,
        }: {
            user: { target?: User };
            role: { role: Role };
            subcommand: 'user' | 'server' | 'role';
        }
    ) {
        if (!interaction.guild) return;
        switch (subcommand) {
            case 'user': {
                let { target } = user;
                if (!target) target = interaction.user;
                target = await this.client.users.fetch(target.id, {
                    force: true,
                });
                let Status = '';
                const status = user.target?.presence?.status;
                const userFlags = await target
                    .fetchFlags()
                    .then((flags) => convertUFB(flags as never))
                    .then((flags) =>
                        flags.map(
                            (f) =>
                                this.client.emojis.cache
                                    .find((e) => e.name === f)
                                    ?.toString() || f
                        )
                    );
                const Device = target.presence?.clientStatus;
                let device = '';
                if (Device) {
                    const platform = Object.keys(Device) as (
                        | 'web'
                        | 'desktop'
                        | 'mobile'
                    )[];
                    for (const p of platform) {
                        switch (p) {
                            case 'web':
                                device += `Web ${this.client.config.clientMap.web}\n`;

                                break;
                            case 'desktop':
                                device += `${interaction.guild?.i18n.__mf(
                                    'userinfo.desktop',
                                    {
                                        x: this.client.config.clientMap.desktop,
                                    }
                                )}\n`;
                                break;
                            case 'mobile':
                                device += `Mobile ${this.client.config.clientMap.mobile}\n`;
                                break;
                            default:
                                device = 'N/A';
                                break;
                        }
                    }
                } else device = 'N/A';

                if (interaction.guild?.ownerId === target.id) {
                    userFlags.push('<:GUILD_OWNER:812992729797230592>');
                }
                if (this.client.isOwner(target)) {
                    userFlags.push('<:Bot_Owner:864234649960972298>');
                }

                switch (status) {
                    case 'dnd': {
                        Status = interaction.guild.i18n.__mf('userinfo.dnd');
                        break;
                    }
                    case 'online': {
                        Status = interaction.guild.i18n.__mf('userinfo.online');
                        break;
                    }
                    case 'offline': {
                        Status =
                            interaction.guild.i18n.__mf('userinfo.offline');
                        break;
                    }
                    case 'idle': {
                        Status = interaction.guild.i18n.__mf('userinfo.idle');
                        break;
                    }
                    default: {
                        Status =
                            interaction.guild.i18n.__mf('userinfo.offline');
                        break;
                    }
                }
                if (interaction.guild?.available) {
                    const member = interaction.guild?.members.cache.get(
                        target.id
                    );
                    if (member?.permissions.has('ADMINISTRATOR')) {
                        userFlags.push('<:ADMINISTRATOR:827241621270560788>');
                    }
                    if (member?.premiumSinceTimestamp) {
                        userFlags.push('<:ServerBooster:850729871477833759>');
                    }

                    if (
                        target.avatar?.startsWith('a_') ||
                        member?.premiumSince
                    ) {
                        userFlags.push('<:Discord_Nitro:859137224187707402>');
                    }
                    const embeduser = new MessageEmbed()
                        .setAuthor(
                            interaction.guild.i18n.__mf('userinfo.user', {
                                tag: target.tag,
                            }),
                            member?.user.displayAvatarURL({
                                dynamic: true,
                                format: 'png',
                                size: 512,
                            }),
                            'https://discord.com/'
                        )
                        .setDescription(userFlags.join(' '))
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.member'),
                            String(member),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.name'),
                            target.tag,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.nickname'),
                            member?.nickname
                                ? `${member.nickname}`
                                : interaction.guild.i18n.__mf(
                                      'userinfo.not_set'
                                  ),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'userinfo.account_creation_date'
                            ),
                            `${moment(target.createdAt).format(
                                `[${interaction.guild.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            )}\n\`${moment(target.createdAt, 'DD/MM/YYYY')
                                .locale(interaction.guild.i18n.getLocale())
                                .fromNow()}\``,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'userinfo.arrival_date'
                            ),
                            `${moment(member?.joinedAt).format(
                                `[${interaction.guild.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            )}\n\`${moment(member?.joinedAt, 'DD/MM/YYYY')
                                .locale(interaction.guild.i18n.getLocale())
                                .fromNow()}\``,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'userinfo.boost_start_date'
                            ),
                            member?.premiumSince
                                ? `${moment(member.premiumSince).format(
                                      `[${interaction.guild.i18n.__mf(
                                          'common.on'
                                      )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                          'common.at'
                                      )}] HH:mm:ss`
                                  )}\n\`${moment(
                                      member.premiumSince,
                                      'DD/MM/YYYY'
                                  )
                                      .locale(
                                          interaction.guild.i18n.getLocale()
                                      )
                                      .fromNow()}\``
                                : interaction.guild.i18n.__mf(
                                      'userinfo.not_boosting'
                                  ),
                            true
                        )
                        .addField('Presence', Status, true)
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.device'),
                            device,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.type'),
                            target.bot
                                ? 'Bot'
                                : interaction.guild.i18n.__mf('userinfo.user2'),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.roles', {
                                role: (member?.roles.cache.size ?? 1) - 1,
                            }),
                            (member?.roles.cache.size ?? 1) - 1 <= 0
                                ? interaction.guild.i18n.__mf(
                                      'userinfo.no_roles'
                                  )
                                : member?.roles.cache
                                      .filter(
                                          (r) => r.id !== interaction.guild?.id
                                      )
                                      .sort(
                                          (A, B) =>
                                              B.rawPosition - A.rawPosition
                                      )
                                      .map((x) => `${x}`)
                                      .splice(0, 50)
                                      .join(' | ') || '\u200b'
                        )
                        .setThumbnail(
                            target.displayAvatarURL({
                                dynamic: true,
                                size: 4096,
                            })
                        )
                        .setFooter(`ID : ${target.id}`)
                        .setColor(member?.displayHexColor || 'GREY');
                    if (target.banner) {
                        embeduser.setImage(
                            target.bannerURL({
                                format: 'png',
                                size: 4096,
                                dynamic: true,
                            }) ?? ''
                        );
                    }
                    return interaction.reply({ embeds: [embeduser] });
                } else {
                    const embeduser = new MessageEmbed()
                        .setAuthor(
                            interaction.guild.i18n.__mf('userinfo.user', {
                                tag: target.tag,
                            }),
                            target.displayAvatarURL({
                                dynamic: true,
                                format: 'png',
                                size: 512,
                            }),
                            'https://discord.com/'
                        )
                        .setDescription(userFlags.join(' '))
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.name'),
                            target.tag,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'userinfo.account_creation_date'
                            ),
                            `${moment(target.createdAt).format(
                                `[${interaction.guild.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            )}\n\`${moment(target.createdAt, 'DD/MM/YYYY')
                                .locale(interaction.guild.i18n.getLocale())
                                .fromNow()}\``,
                            true
                        )
                        .addField('Presence', Status, true)
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.device'),
                            device,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('userinfo.type'),
                            target.bot
                                ? 'Bot'
                                : interaction.guild.i18n.__mf('userinfo.user2'),
                            true
                        )
                        .setThumbnail(
                            target.displayAvatarURL({
                                dynamic: true,
                                size: 4096,
                            })
                        )
                        .setFooter(`ID : ${target.id}`)
                        .setColor(target?.hexAccentColor || 'GREY');
                    if (target.banner) {
                        embeduser.setImage(
                            target.bannerURL({
                                format: 'png',
                                size: 4096,
                                dynamic: true,
                            }) ?? ''
                        );
                    }
                    return interaction.reply({ embeds: [embeduser] });
                }
            }
            case 'server': {
                if (interaction.guild?.available) {
                    const { afkTimeout } = interaction.guild;
                    const botcount = interaction.guild.members.cache.filter(
                        (member) => member.user.bot
                    ).size;
                    const humancount = interaction.guild.members.cache.filter(
                        (member) => !member.user.bot
                    ).size;
                    const owner = interaction.guild.members.resolve(
                        interaction.guild.ownerId
                    );
                    const embedserv = new MessageEmbed()
                        .setAuthor(
                            interaction.guild.name,
                            interaction.guild.iconURL({ dynamic: true }) ?? ''
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.owner'),
                            `${owner}\n(\`${owner?.user.tag ?? '????'}\`)`,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.name'),
                            interaction.guild.name,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.members'),
                            `${
                                interaction.guild.memberCount
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.members2'
                            )}\n${humancount} ${interaction.guild.i18n.__mf(
                                'serverinfo.humans'
                            )}\n${botcount} ${interaction.guild.i18n.__mf(
                                'serverinfo.bots'
                            )}`,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'serverinfo.online_members'
                            ),
                            interaction.guild.members.cache
                                .filter(
                                    ({ presence }) =>
                                        presence?.status !== 'offline'
                                )
                                .size.toString(),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.channels'),
                            `${
                                interaction.guild.channels.cache.size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.channels2'
                            )}\n${
                                interaction.guild.channels.cache.filter(
                                    (channel) => channel.type === 'GUILD_TEXT'
                                ).size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.text_channels'
                            )}\n${
                                interaction.guild.channels.cache.filter(
                                    (channel) => channel.type === 'GUILD_VOICE'
                                ).size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.voice_channels'
                            )}\n${
                                interaction.guild.channels.cache.filter(
                                    (channel) =>
                                        channel.type === 'GUILD_CATEGORY'
                                ).size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.category'
                            )}`,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.emotes'),
                            `${interaction.guild.emojis.cache.size} emojis\n${
                                interaction.guild.emojis.cache.filter(
                                    (emoji) => !emoji.animated
                                ).size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.static_emotes'
                            )}\n${
                                interaction.guild.emojis.cache.filter(
                                    (emoji) => emoji.animated ?? false
                                ).size
                            } ${interaction.guild.i18n.__mf(
                                'serverinfo.animated_emotes'
                            )}`,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('common.creation_date'),
                            `${moment(interaction.guild.createdAt).format(
                                `[${interaction.guild.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            )}\n\`${moment(
                                interaction.guild.createdAt,
                                'DD/MM/YYYY'
                            )
                                .locale(interaction.guild.i18n.getLocale())
                                .fromNow()}\``,
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.nitro'),
                            interaction.guild.i18n.__mf('serverinfo.tier', {
                                tier: interaction.guild.premiumTier,
                                // eslint-disable-next-line camelcase
                                boost_number:
                                    interaction.guild.premiumSubscriptionCount,
                            }),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.afk'),
                            this.client.utils.format(afkTimeout),
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf(
                                'serverinfo.verification_level'
                            ),
                            this.client.config.verificationLVL[
                                interaction.guild.verificationLevel
                            ],
                            true
                        )
                        .addField(
                            interaction.guild.i18n.__mf('serverinfo.roles', {
                                role: interaction.guild.roles.cache.size - 1,
                            }),
                            trimArray(
                                interaction.guild.roles.cache
                                    .filter(
                                        (r) => r.id !== interaction.guild?.id
                                    )
                                    .sort(
                                        (A, B) => B.rawPosition - A.rawPosition
                                    )
                                    .map((x) => `${x}`),
                                { maxLength: 30 }
                            ).join(' | ') || '\u200b',
                            false
                        )
                        .setFooter(
                            interaction.guild.i18n.__mf('serverinfo.id', {
                                id: interaction.guild.id,
                            })
                        )
                        .setThumbnail(
                            interaction.guild.iconURL({
                                dynamic: true,
                                size: 4096,
                                format: 'png',
                            }) ??
                                'https://cdn.discordapp.com/embed/avatars/0.png'
                        );
                    return interaction.reply({ embeds: [embedserv] });
                } else {
                    return interaction.reply(
                        'This command cannot be used in DMs.'
                    );
                }
            }
            case 'role': {
                const { role } = _role;
                if (!interaction.guild?.available)
                    return interaction.reply(
                        'This command cannot be used in DMs.'
                    );
                let permsArray = joinArray(
                    translatePermissions(
                        role.permissions.toArray(),
                        interaction.guild.i18n.getLocale()
                    ).map(
                        (perm) =>
                            `\`${perm
                                .toLowerCase()
                                .replace(/(^|"|_)(\S)/g, (x) =>
                                    x.toUpperCase()
                                )}\``
                    ),
                    interaction.guild.i18n.getLocale()
                );
                permsArray = permsArray
                    .toString()
                    .replace(/_/g, ' ')
                    .replace(/Use Vad/g, 'Use Voice Activity')
                    .replace(/Guild/g, 'Server');
                const embed = new MessageEmbed()
                    .setDescription('Permissions\n')
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.role'),
                        `${role}`,
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.role_name'),
                        role.name,
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.who_own_it'),
                        role.members.size.toString(),
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.color'),
                        role.hexColor,
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('common.creation_date'),
                        moment(role.createdAt).format(
                            `[${interaction.guild.i18n.__mf(
                                'roleinfo.on'
                            )}] DD/MM/YYYY [${interaction.guild.i18n.__mf(
                                'roleinfo.at'
                            )}] HH:mm:ss`
                        ),
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.hoisted'),
                        role.hoist
                            ? interaction.guild.i18n.__mf('common.yes')
                            : interaction.guild.i18n.__mf('common.no'),
                        true
                    )
                    .addField(
                        interaction.guild.i18n.__mf('roleinfo.mentionable'),
                        role.mentionable
                            ? interaction.guild.i18n.__mf('common.yes')
                            : interaction.guild.i18n.__mf('common.no'),
                        true
                    )
                    .addField('Permissions', permsArray)
                    .setFooter(`ID : ${role.id}`)
                    .setColor(role.hexColor);
                interaction.reply({ embeds: [embed] });
            }
        }
    }
}
