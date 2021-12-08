import SlashCommand from '../../struct/SlashCommand';
import KiwiiClient from '../../struct/Client';
import { CommandInteraction, User, MessageEmbed } from 'discord.js';

export default class AvatarCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'avatar',
            description: 'Get the avatar of yourself or the specified user',
            commandOptions: [
                {
                    name: 'user',
                    description: 'The user to display',
                    type: 6,
                    required: false,
                },
            ],
        });
    }

    public execute(
        interaction: CommandInteraction,
        { user }: { user: User }
    ): void {
        if (!user) user = interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);
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
                    user.avatar?.startsWith('a_')
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
            .setColor(member?.displayHexColor || 'GREY');
        interaction.reply({ embeds: [embed] });
    }
}
