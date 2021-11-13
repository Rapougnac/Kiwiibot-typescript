import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';
import KiwiiClient from '../../struct/Client';
import Command from '../../struct/Command';
import { trimArray } from '../../util/string';
export default class ServerInfoCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'serverinfo',
            aliases: ['si', 'servinf', 'servi', 'sinfo'],
            description: '',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}serverinfo',
            guildOnly: true,
            img: 'https://cdn-icons-png.flaticon.com/512/3208/3208727.png',
        });
    }
    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
        const { guild } = message;
        if (!guild) return;
        const { afkTimeout } = guild;
        const botcount = guild.members.cache.filter(
            (member) => member.user.bot
        ).size;
        const humancount = guild.members.cache.filter(
            (member) => !member.user.bot
        ).size;
        const owner = await message.guild!.fetchOwner();
        const embedserv = new MessageEmbed()
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }) ?? '')
            .addField(
                message.guild!.i18n.__mf('serverinfo.owner'),
                `<@!${message.guild!.ownerId}>\n(\`${owner.user.tag}\`)`,
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.name'),
                guild.name,
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.region'),
                guild.available ? guild.preferredLocale : 'N/A',
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.members'),
                `${guild.memberCount} ${message.guild!.i18n.__mf(
                    'serverinfo.members2'
                )}\n${humancount} ${message.guild!.i18n.__mf(
                    'serverinfo.humans'
                )}\n${botcount} ${message.guild!.i18n.__mf('serverinfo.bots')}`,
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.online_members'),
                String(
                    message.guild!.members.cache.filter(
                        ({ presence }) => presence?.status !== 'offline'
                    ).size
                ),
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.channels'),
                `${
                    message.guild!.channels.cache.size
                } ${message.guild!.i18n.__mf('serverinfo.channels2')}\n${
                    message.guild!.channels.cache.filter(
                        (channel) => channel.type === 'GUILD_TEXT'
                    ).size
                } ${message.guild!.i18n.__mf('serverinfo.text_channels')}\n${
                    message.guild!.channels.cache.filter(
                        (channel) => channel.type === 'GUILD_VOICE'
                    ).size
                } ${message.guild!.i18n.__mf('serverinfo.voice_channels')}\n${
                    message.guild!.channels.cache.filter(
                        (channel) => channel.type === 'GUILD_CATEGORY'
                    ).size
                } ${message.guild!.i18n.__mf('serverinfo.category')}`,
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.emotes'),
                `${message.guild!.emojis.cache.size} emojis\n${
                    message.guild!.emojis.cache.filter(
                        (emoji) => !emoji.animated ?? false
                    ).size
                } ${message.guild!.i18n.__mf('serverinfo.static_emotes')}\n${
                    message.guild!.emojis.cache.filter(
                        (emoji) => emoji.animated ?? false
                    ).size
                } ${message.guild!.i18n.__mf('serverinfo.animated_emotes')}`,
                true
            )
            .addField(
                message.guild!.i18n.__mf('common.creation_date'),
                moment(message.guild!.createdAt).format(
                    `[${message.guild!.i18n.__mf(
                        'common.on'
                    )}] DD/MM/YYYY [${message.guild!.i18n.__mf(
                        'common.at'
                    )}] HH:mm:ss`
                ),
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.nitro'),
                message.guild!.i18n.__mf('serverinfo.tier', {
                    tier: message.guild!.premiumTier,
                    boost_number: message.guild!.premiumSubscriptionCount,
                }),
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.afk'),
                format(afkTimeout),
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.verification_level'),
                client.config.verificationLVL[message.guild!.verificationLevel],
                true
            )
            .addField(
                message.guild!.i18n.__mf('serverinfo.roles', {
                    role: message.guild!.roles.cache.size - 1,
                }),
                trimArray(
                    message
                        .guild!.roles.cache.filter(
                            (r) => r.id !== message.guild!.id
                        )
                        .sort((A, B) => B.rawPosition - A.rawPosition)
                        .map((x) => `${x}`),
                    { maxLength: 30 }
                ).join(' | ') || '\u200b',
                false
            )
            .setFooter(
                message.guild!.i18n.__mf('serverinfo.id', {
                    id: message.guild!.id,
                })
            )
            .setThumbnail(message.guild!.iconURL({ dynamic: true }) ?? '');
        message.channel.send({ embeds: [embedserv] });
    }
}

const format = (time: number) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    var ret = '';
    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return `\`${ret}\``;
};
