import {
    Message,
    MessageEmbed,
    MessageAttachment,
    Snowflake,
    Collection,
} from 'discord.js';
import Command from '../../struct/Command';
import Client from '../../struct/Client';
export default class FirstMessageCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'firstmessage',
            aliases: ['fm', 'first-message'],
            description: 'Get the first message of the current channel',
            category: 'infos',
            cooldown: 5,
            utilisation: '{prefix}firstmessage',
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async execute(client: Client, message: Message, args: string[]) {
        if (!message.guild) return;
        const fetchMessages = (await message.channel.messages.fetch({
            after: 1,
            limit: 1,
        } as any)) as unknown as Collection<Snowflake, Message>;
        const msg = fetchMessages.first();
        if (!msg)
            return message.inlineReply(
                message.guild.i18n.__mf('firstmessage.not_found')
            );

        const embed = new MessageEmbed()
            .setTitle(
                message.guild.i18n.__mf('firstmessage.first_message', {
                    channel_name:
                        message.channel.type === 'text'
                            ? message.channel.name
                            : '',
                })
            )
            .setURL(msg.url)
            .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(
                message.guild.i18n.__mf('firstmessage.content') + msg.content
            )
            .addField(
                message.guild.i18n.__mf('firstmessage.author'),
                msg.author,
                true
            )
            .addField(
                message.guild.i18n.__mf('firstmessage.msg_id'),
                msg.id,
                true
            )
            .addField(
                message.guild.i18n.__mf('firstmessage.created'),
                msg.createdAt.toLocaleDateString(),
                true
            );
        message.channel.send(embed);
    }
}
