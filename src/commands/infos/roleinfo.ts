import { MessageEmbed, Message } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';
import Client from '../../struct/Client';
import Command from '../../struct/Command';
export default class RoleInfoCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'roleinfo',
            aliases: ['ri'],
            description: 'Shows informations about the mentionned role',
            category: 'infos',
            utilisation: '{prefix}roleinfo [role]',
            img: 'https://cdn-icons-png.flaticon.com/512/4406/4406353.png',
        });
    }
    public execute(
        client: Client,
        message: Message,
        args: string[]
    ): void | Promise<Message> {
        if (!message.guild) return;
        let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[0]) ||
            message.guild.roles.cache.find(
                (r) =>
                    r.name
                        .toLowerCase()
                        .startsWith(args.join(' ').toLowerCase()) ||
                    r.name.toLowerCase().endsWith(args.join(' ').toLowerCase())
            ) ||
            message.guild.roles.cache.find((r) =>
                r.name.includes(args.join(' '))
            );
        if (args.length <= 0) role = undefined;
        if (!role)
            return message.channel.send(
                message.guild.i18n.__mf('roleinfo.specify_role')
            );
        let string = String();
        const permsArr = role.permissions.toArray();
        permsArr.forEach((perm) => {
            string += `\`${perm
                .toLowerCase()
                .replace(/(^|"|_)(\S)/g, (z) => z.toUpperCase())
                .replace(/_/g, ' ')
                .replace(/Use Vad/g, 'Use Voice Activity')
                .replace(/Guild/g, 'Server')}\`, `;
        });

        message.channel.send(
            new MessageEmbed()
                .setDescription('Permissions\n' + string)
                .addField(message.guild.i18n.__mf('roleinfo.role'), role, true)
                .addField(
                    message.guild.i18n.__mf('roleinfo.role_name'),
                    role.name,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('roleinfo.who_own_it'),
                    role.members.size,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('roleinfo.color'),
                    role.hexColor,
                    true
                )
                .addField(
                    message.guild.i18n.__mf('common.creation_date'),
                    moment(role.createdAt).format(
                        `[${message.guild.i18n.__mf(
                            'common.on'
                        )}] DD/MM/YYYY [${message.guild.i18n.__mf(
                            'common.at'
                        )}] HH:mm:ss`
                    ),
                    true
                )
                .addField(
                    message.guild.i18n.__mf('roleinfo.hoisted'),
                    role.hoist
                        ? message.guild.i18n.__mf('common.yes')
                        : message.guild.i18n.__mf('common.no'),
                    true
                )
                .addField(
                    message.guild.i18n.__mf('roleinfo.mentionable'),
                    role.mentionable
                        ? message.guild.i18n.__mf('common.yes')
                        : message.guild.i18n.__mf('common.no'),
                    true
                )
                .setFooter(`ID : ${role.id}`)
                .setColor(role.hexColor)
        );
    }
}
