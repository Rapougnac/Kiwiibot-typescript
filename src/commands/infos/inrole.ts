import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class InRoleCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'inrole',
            aliases: ['ir'],
            description: 'Get all members with the specified role',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}inrole [role id, mention or name]',
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async execute(client: Client, message: Message, args: string[]) {
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
            return message.inlineReply(
                message.guild.i18n.__mf('inrole.missing_role'),
                {
                    allowedMentions: { repliedUser: false },
                }
            );
        const memRole = message.guild.roles.cache
            .get(role.id)!
            .members.map((m) => `${m.user.tag}${m.user.bot ? '[BOT]' : ''}`)
            .join('\n');
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                    format: 'png',
                })
            )
            .setTitle(
                message.guild.i18n.__mf('inrole.dislay_role', {
                    role_name: role.name,
                })
            )
            .setColor(role.color)
            .setDescription(`\`\`\`css\n${memRole}\`\`\``);
        message.channel.send(embed);
    }
}