import type { Message, GuildMember, PresenceStatus } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import type Client from '../../struct/Client';
import moment from 'moment';
import 'moment-duration-format';
import { convertUFB } from '../../util/string';
import { isEmpty } from 'lodash';
export default class UserInfoCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'userinfo',
            aliases: ['ui'],
            description: 'Shows informations about you or a user',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}userinfo <user>',
            guildOnly: true,
            clientPermissions: ['EMBED_LINKS'],
            img: 'https://image.flaticon.com/icons/png/512/5674/5674839.png',
        });
    }
    public async execute(client: Client, message: Message, args: string[]) {
        if (!message.guild) return;
        let member =
            message.mentions.members?.first() ||
            message.guild.members.cache.get(args[0] ?? '') ||
            message.guild.members.cache.find(
                (r) =>
                    r.user.username
                        .toLowerCase()
                        .startsWith(args.join(' ').toLowerCase()) ||
                    r.user.username
                        .toLowerCase()
                        .endsWith(args.join(' ').toLowerCase())
            ) ||
            message.guild.members.cache.find(
                (r) =>
                    r.displayName
                        .toLowerCase()
                        .startsWith(args.join(' ').toLowerCase()) ||
                    r.displayName
                        .toLowerCase()
                        .endsWith(args.join(' ').toLowerCase())
            );
        if (args.length <= 0) member = message.member as GuildMember;
        if (member) {
            const { user: _user } = member;
            const user = await client.users.fetch(_user, {
                force: true,
            });
            let status =
                (member.presence?.status as PresenceStatus | string) ?? 'N/A';
            const userFlags = (await user
                .fetchFlags()
                .then((flags) => convertUFB(flags.bitfield))
                .then((flags) =>
                    flags.map(
                        (key) =>
                            client.emojis.cache
                                .find((x) => x.name === key)
                                ?.toString() || key
                    )
                )
                .catch(() => [])) as string[];
            const Device = member.presence?.clientStatus ?? 'N/A';
            let device = '';
            if (!isEmpty(Device)) {
                const platform = Object.keys(Device ?? {});
                platform.forEach((dev) => {
                    switch (dev) {
                        case 'web': {
                            device += `Web ${client.config.clientMap.web}\n`;
                            break;
                        }
                        case 'desktop': {
                            device += `${message.guild?.i18n.__mf(
                                'userinfo.desktop',
                                {
                                    x: client.config.clientMap.desktop,
                                }
                            )}\n`;
                            break;
                        }
                        case 'mobile': {
                            device += `Mobile ${client.config.clientMap.mobile}\n`;
                            break;
                        }
                        default: {
                            device = 'N/A';
                        }
                    }
                });
            } else {
                if (member.user.bot) {
                    device = `Web ${client.config.clientMap.web}\n`;
                } else {
                    device = 'N/A';
                }
            }
            if (message.guild.ownerId === user.id) {
                userFlags.push('<:GUILD_OWNER:812992729797230592>');
            }
            if (member.permissions.has('ADMINISTRATOR')) {
                userFlags.push('<:ADMINISTRATOR:827241621270560788>');
            }
            if (member.premiumSinceTimestamp ?? 0 > 0) {
                userFlags.push('<:ServerBooster:850729871477833759>');
            }
            if (
                (user.avatar && user.avatar.startsWith('a_')) ||
                member.premiumSince ||
                user.banner
            ) {
                userFlags.push('<:Discord_Nitro:859137224187707402>');
            }
            if (this.client.isOwner(user)) {
                userFlags.push('<:Bot_Owner:864234649960972298>');
            }
            switch (status) {
                case 'dnd': {
                    status = message.guild.i18n.__mf('userinfo.dnd');
                    break;
                }
                case 'online': {
                    status = message.guild.i18n.__mf('userinfo.online');
                    break;
                }
                case 'offline': {
                    status = message.guild.i18n.__mf('userinfo.offline');
                    break;
                }
                case 'idle': {
                    status = message.guild.i18n.__mf('userinfo.idle');
                    break;
                }
            }
            const lang = message.guild.i18n.getLocale();
            const embeduser = new MessageEmbed()
                .setAuthor(
                    message.guild.i18n.__mf('userinfo.user', { tag: user.tag }),
                    user.displayAvatarURL({
                        dynamic: true,
                        format: 'png',
                        size: 512,
                    }),
                    'https://discord.com/'
                )
                .setDescription(userFlags.join(' '))
                .addField(
                    message.guild.i18n.__mf('userinfo.member'),
                    `<@${member.id}>`,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.name'),
                    member.user.tag,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.nickname'),
                    member.nickname
                        ? `${member.nickname}`
                        : message.guild.i18n.__mf('userinfo.not_set'),
                    true
                )
                .addField(
                    message.guild.i18n.__mf('common.creation_date'),
                    `${moment(member.user.createdAt).format(
                        `[${message.guild.i18n.__mf(
                            'common.on'
                        )}] DD/MM/YYYY [${message.guild.i18n.__mf(
                            'common.at'
                        )}] HH:mm:ss`
                    )}\n\`${moment(member.user.createdAt, 'DD/MM/YYYY')
                        .locale(lang ?? 'en')
                        .fromNow()}\``,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.arrival_date'),
                    `${moment(member.joinedAt).format(
                        `[${message.guild.i18n.__mf(
                            'common.on'
                        )}] DD/MM/YYYY [${message.guild.i18n.__mf(
                            'common.at'
                        )}] HH:mm:ss`
                    )}\n\`${moment(member.joinedAt, 'DD/MM/YYYY')
                        .locale(lang ?? 'en')
                        .fromNow()}\``,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.boost_start_date'),
                    member.premiumSince
                        ? `${moment(member.premiumSince).format(
                              `[${message.guild.i18n.__mf(
                                  'common.on'
                              )}] DD/MM/YYYY [${message.guild.i18n.__mf(
                                  'common.at'
                              )}] HH:mm:ss`
                          )}\n\`${moment(member.premiumSince, 'DD/MM/YYYY')
                              .locale(lang ?? 'en')
                              .fromNow()}\``
                        : message.guild.i18n.__mf('userinfo.not_boosting'),
                    true
                )
                .addField('Presence', status, true)
                .addField(
                    message.guild.i18n.__mf('userinfo.device'),
                    device,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.type'),
                    member.user.bot
                        ? 'Bot'
                        : message.guild.i18n.__mf('userinfo.user2'),
                    true
                )
                .addField(
                    message.guild.i18n.__mf('userinfo.roles', {
                        role: member.roles.cache.size - 1,
                    }),
                    member.roles.cache.size - 1 <= 0
                        ? message.guild.i18n.__mf('userinfo.no_roles')
                        : member.roles.cache
                              .filter((r) => r.id !== message.guild?.id)
                              .sort((A, B) => B.rawPosition - A.rawPosition)
                              .map((x) => String(x))
                              .splice(0, 50)
                              .join(' | ') || '\u200b'
                )
                .setThumbnail(
                    user.displayAvatarURL({
                        size: 4096,
                        format: 'png',
                        dynamic: true,
                    })
                )
                .setFooter(`ID : ${member.id}`)
                .setColor(member.displayHexColor || 'GREY');
            if (user.banner) {
                embeduser.setImage(
                    user.bannerURL({
                        format: 'png',
                        size: 4096,
                        dynamic: true,
                    }) ?? ''
                );
            }
            await message.channel.send({ embeds: [embeduser] });
        } else {
            await message.reply(
                message.guild.i18n.__mf('userinfo.cant_find_member')
            );
        }
    }
}
