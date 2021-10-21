import { Message, MessageEmbed, MessageAttachment, User } from 'discord.js';
import CommandInteraction from '../../struct/Interactions/CommandInteraction';
import SlashCommand from '../../struct/SlashCommand';
import Client from '../../struct/Client';
export default class AvatarSlashCommand extends SlashCommand {
    constructor(client: Client) {
        super(client, {
            name: 'avatar',
            description: 'Get the avatar of yourself or the specified user.',
            global: false,
            commandOptions: [
                {
                    name: 'user',
                    description: 'User to display.',
                    type: 6,
                    required: false,
                },
            ],
        });
    }
    public async execute(
        interaction: CommandInteraction,
        client: Client,
        { user }: { user: User }
    ) {
        const { guild } = interaction;
        if (guild) {
            if (!user) user = interaction.user;
            const member = guild.member(user);
            if (!member) return;
            const embed = new MessageEmbed()
                .setAuthor(`Avatar of ${user.username}`)
                .setDescription(
                    `If the image is not displayed, [click here](${user.displayAvatarURL(
                        {
                            size: 4096,
                            dynamic: true,
                            format: 'png',
                        }
                    )})\n\nFormat: [webp](${user.displayAvatarURL({
                        size: 4096,
                    })}) • [jpg](${user.displayAvatarURL({
                        format: 'jpg',
                        size: 4096,
                    })}) • [jpeg](${user.displayAvatarURL({
                        format: 'jpeg',
                        size: 4096,
                    })}) • [png](${user.displayAvatarURL({
                        format: 'png',
                        size: 4096,
                    })}) ${
                        user.avatar!.startsWith('a_')
                            ? ` • [gif](${user.displayAvatarURL({
                                  dynamic: true,
                                  format: 'gif',
                                  size: 4096,
                              })})`
                            : ''
                    }`
                )
                .setImage(
                    user.displayAvatarURL({
                        size: 4096,
                        dynamic: true,
                        format: 'png',
                    })
                )
                .setColor(member.displayHexColor || 'GREY');
            interaction.send(embed as unknown as any);
        } else {
            if (!user) user = interaction.user;
            const embed = new MessageEmbed()
                .setAuthor(`Avatar of ${user.username}`)
                .setDescription(
                    `If the image is not displayed, [click here](${user.displayAvatarURL(
                        {
                            size: 4096,
                            dynamic: true,
                            format: 'png',
                        }
                    )})\n\nFormat: [webp](${user.displayAvatarURL({
                        size: 4096,
                    })}) • [jpg](${user.displayAvatarURL({
                        format: 'jpg',
                        size: 4096,
                    })}) • [jpeg](${user.displayAvatarURL({
                        format: 'jpeg',
                        size: 4096,
                    })}) • [png](${user.displayAvatarURL({
                        format: 'png',
                        size: 4096,
                    })}) ${
                        user.avatar!.startsWith('a_')
                            ? ` • [gif](${user.displayAvatarURL({
                                  dynamic: true,
                                  format: 'gif',
                                  size: 4096,
                              })})`
                            : ''
                    }`
                )
                .setImage(
                    user.displayAvatarURL({
                        size: 4096,
                        dynamic: true,
                        format: 'png',
                    })
                )
                .setColor('GREY');
            interaction.send(embed as unknown as any);
        }
    }
}
