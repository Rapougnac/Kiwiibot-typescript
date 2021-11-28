import { Message, MessageEmbed, GuildMember, User } from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class AvatarCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'avatar',
            aliases: ['pp', 'pfp', 'profilepicture'],
            description: 'Get your avatar ou the specified user',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}avatar <member>',
            clientPermissions: ['EMBED_LINKS'],
            img: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        });
    }
    public async execute(_client: Client, message: Message, args: string[]) {
        let member: GuildMember | User | undefined;
        if (message.channel.type === 'DM' && !message.guild?.available) {
            message.author = await this.client.users.fetch(message.author, {
                force: true,
            });
            member = message.author;
        } else {
            member =
                message.mentions.members?.first() ||
                message.guild?.members.cache.get(args[0]!) ||
                message.guild?.members.cache.find(
                    (r) =>
                        r.user.username
                            .toLowerCase()
                            .startsWith(args.join(' ').toLowerCase()) ||
                        r.user.username
                            .toLowerCase()
                            .endsWith(args.join(' ').toLowerCase())
                ) ||
                message.guild?.members.cache.find(
                    (r) =>
                        r.displayName
                            .toLowerCase()
                            .startsWith(args.join(' ').toLowerCase()) ||
                        r.displayName
                            .toLowerCase()
                            .endsWith(args.join(' ').toLowerCase())
                ) ||
                message.guild?.members.cache.find((r) =>
                    r.user.username.toLowerCase().includes(args.join(' '))
                );

            if (args.length <= 0) member = message.member as GuildMember;
        }
        if (!member) return;

        const embed = new MessageEmbed()
            .setAuthor(
                `${message.guild?.i18n.__mf('avatar.avatar_of', {
                    avatar:
                        member instanceof GuildMember
                            ? member.user.username
                            : member.username,
                })}`
            )
            .setDescription(
                `${message.guild?.i18n.__mf('avatar.msg')}(${
                    member instanceof GuildMember
                        ? member.user.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'png',
                          })
                        : member.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'png',
                          })
                })\n\nFormat: [webp](${
                    member instanceof GuildMember
                        ? member.user.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'webp',
                          })
                        : member.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'webp',
                          })
                }) • [jpg](${
                    member instanceof GuildMember
                        ? member.user.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'webp',
                          })
                        : member.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'webp',
                          })
                }) • [jpeg](${
                    member instanceof GuildMember
                        ? member.user.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'jpeg',
                          })
                        : member.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'jpeg',
                          })
                }) • [png](${
                    member instanceof GuildMember
                        ? member.user.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'png',
                          })
                        : member.displayAvatarURL({
                              size: 4096,
                              dynamic: true,
                              format: 'png',
                          })
                }) ${
                    member instanceof GuildMember
                        ? member.user.avatar!.startsWith('a_')
                            ? ` • [gif](${member.user.displayAvatarURL({
                                  dynamic: true,
                                  format: 'gif',
                                  size: 4096,
                              })})`
                            : ''
                        : member.avatar!.startsWith('a_')
                        ? ` • [gif](${member.displayAvatarURL({
                              dynamic: true,
                              format: 'gif',
                              size: 4096,
                          })})`
                        : ''
                }`
            )
            .setImage(
                member instanceof GuildMember
                    ? member.user.displayAvatarURL({
                          size: 4096,
                          dynamic: true,
                          format: 'png',
                      })
                    : member.displayAvatarURL({
                          size: 4096,
                          dynamic: true,
                          format: 'png',
                      })
            )
            .setColor(member instanceof GuildMember ? member.displayHexColor : member.hexAccentColor || 'GREY');
        message.channel.send({ embeds: [embed] });
    }
}
