import {
    Message,
    MessageEmbed,
    User,
    Role,
    CommandInteraction,
} from 'discord.js';
import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';
import { convertUFB } from '../../util/string';
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
            role,
        }: {
            user: { target?: User };
            role: { role: Role };
            subcommand: 'user' | 'server' | 'role';
        }
    ) {
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
                    .then((flags) => convertUFB(flags as any))
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
                                device +=
                                    'Web ' +
                                    this.client.config.clientMap.web +
                                    '\n';

                                break;
                            case 'desktop':
                                device +=
                                    interaction.guild?.i18n.__mf(
                                        'userinfo.desktop',
                                        {
                                            x: this.client.config.clientMap
                                                .desktop,
                                        }
                                    ) + '\n';
                                break;
                            case 'mobile':
                                device +=
                                    'Mobile ' +
                                    this.client.config.clientMap.mobile +
                                    '\n';
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
                        Status = interaction.guild!.i18n.__mf('userinfo.dnd');
                        break;
                    }
                    case 'online': {
                        Status =
                            interaction.guild!.i18n.__mf('userinfo.online');
                        break;
                    }
                    case 'offline': {
                        Status =
                            interaction.guild!.i18n.__mf('userinfo.offline');
                        break;
                    }
                    case 'idle': {
                        Status = interaction.guild!.i18n.__mf('userinfo.idle');
                        break;
                    }
                    default: {
                        Status =
                            interaction.guild!.i18n.__mf('userinfo.offline');
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
                    if (member?.premiumSinceTimestamp! > 0) {
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
                            interaction.guild!.i18n.__mf('userinfo.user', {
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
                            interaction.guild!.i18n.__mf('userinfo.member'),
                            String(member),
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.name'),
                            target.tag,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.nickname'),
                            member?.nickname
                                ? `${member.nickname}`
                                : interaction.guild!.i18n.__mf(
                                      'userinfo.not_set'
                                  ),
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf(
                                'userinfo.account_creation_date'
                            ),
                            moment(target.createdAt).format(
                                `[${interaction.guild!.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild!.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            ) +
                                `\n\`${moment(target.createdAt, 'DD/MM/YYYY')
                                    .locale(interaction.guild!.i18n.getLocale())
                                    .fromNow()}\``,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf(
                                'userinfo.arrival_date'
                            ),
                            moment(member?.joinedAt).format(
                                `[${interaction.guild!.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild!.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            ) +
                                `\n\`${moment(member?.joinedAt, 'DD/MM/YYYY')
                                    .locale(interaction.guild!.i18n.getLocale())
                                    .fromNow()}\``,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf(
                                'userinfo.boost_start_date'
                            ),
                            member?.premiumSince
                                ? moment(member.premiumSince).format(
                                      `[${interaction.guild!.i18n.__mf(
                                          'common.on'
                                      )}] DD/MM/YYYY [${interaction.guild!.i18n.__mf(
                                          'common.at'
                                      )}] HH:mm:ss`
                                  ) +
                                      `\n\`${moment(
                                          member.premiumSince,
                                          'DD/MM/YYYY'
                                      )
                                          .locale(
                                              interaction.guild!.i18n.getLocale()
                                          )
                                          .fromNow()}\``
                                : interaction.guild!.i18n.__mf(
                                      'userinfo.not_boosting'
                                  ),
                            true
                        )
                        .addField('Presence', Status, true)
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.device'),
                            device,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.type'),
                            target.bot
                                ? 'Bot'
                                : interaction.guild!.i18n.__mf(
                                      'userinfo.user2'
                                  ),
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.roles', {
                                role: member!.roles.cache.size - 1,
                            }),
                            member!.roles.cache.size - 1 <= 0
                                ? interaction.guild!.i18n.__mf(
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
                            })!
                        );
                    }
                    return interaction.reply({ embeds: [embeduser] });
                } else {
                    const embeduser = new MessageEmbed()
                        .setAuthor(
                            interaction.guild!.i18n.__mf('userinfo.user', {
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
                            interaction.guild!.i18n.__mf('userinfo.name'),
                            target.tag,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf(
                                'userinfo.account_creation_date'
                            ),
                            moment(target.createdAt).format(
                                `[${interaction.guild!.i18n.__mf(
                                    'common.on'
                                )}] DD/MM/YYYY [${interaction.guild!.i18n.__mf(
                                    'common.at'
                                )}] HH:mm:ss`
                            ) +
                                `\n\`${moment(target.createdAt, 'DD/MM/YYYY')
                                    .locale(interaction.guild!.i18n.getLocale())
                                    .fromNow()}\``,
                            true
                        )
                        .addField('Presence', Status, true)
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.device'),
                            device,
                            true
                        )
                        .addField(
                            interaction.guild!.i18n.__mf('userinfo.type'),
                            target.bot
                                ? 'Bot'
                                : interaction.guild!.i18n.__mf(
                                      'userinfo.user2'
                                  ),
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
                            })!
                        );
                    }
                    return interaction.reply({ embeds: [embeduser] });
                }
            }
        }
    }
}
