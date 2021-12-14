import type { Message, MessageComponentInteraction } from 'discord.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';

export default class PrefixResetCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'prefix-reset',
            aliases: ['pr', 'clearprefix', 'resetprefix'],
            description: 'Reset the prefix to the default one.',
            category: 'core',
            utilisation: '{prefix}prefix-reset',
            guildOnly: true,
            permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message
    ): Promise<Message | void> {
        if (!message.guild) return;
        if (!client.mySql.connected)
            return await message.channel.send(
                message.guild.i18n.__mf('prefix-reset.no_conn')
            );
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('confirm')
                .setLabel('Yes')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('cancel')
                .setLabel('No')
                .setStyle('DANGER')
        );
        const msg = await message.channel.send({
            content: message.guild.i18n.__mf('prefix-reset.confirmation'),
            components: [row],
        });

        const filter = (component: MessageComponentInteraction) =>
            component.customId === 'confirm' &&
            component.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({
            filter,
            time: 15000,
        });

        collector.on('collect', async (component) => {
            if (!message.guild) return;
            if (component.customId === 'confirm') {
                await component.update({ components: [] });
                await client.mySql.connection.query(
                    `UPDATE \`guildsettings\` SET \`prefix\` = NULL WHERE \`guildId\` = ${message.guild.id}`
                );
                message.guild.prefix = client.prefix;
                await message.channel.send(
                    message.guild.i18n.__mf('prefix-reset.reset_prefix', {
                        prefix: client.prefix,
                    })
                );
            } else if (component.customId === 'cancel') {
                await component.update({ components: [] });
                await msg.delete();
                return void message.channel.send(
                    message.guild.i18n.__mf('prefix-reset.canceled')
                );
            }
        });

        // switch (emoji) {
        //     case '✅': {
        //         await msg.delete();
        //         await client.mySql.connection.query(
        //             `UPDATE \`guildsettings\` SET \`prefix\` = NULL WHERE \`guildId\` = ${message.guild.id}`
        //         );
        //         message.guild.prefix = client.prefix;
        //         await message.channel.send(
        //             message.guild.i18n.__mf('prefix-reset.reset_prefix', {
        //                 prefix: client.prefix,
        //             })
        //         );
        //         break;
        //     }
        //     case '❌': {
        //         await msg.delete();
        //         return await message.channel.send(
        //             message.guild.i18n.__mf('prefix-reset.canceled')
        //         );
        //     }
        // }
    }
}
