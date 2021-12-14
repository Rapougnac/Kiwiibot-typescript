import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';
import type { CacheType, CommandInteraction } from 'discord.js';
import { trimArray } from '../../util/string';
import { search } from 'booru';
import { Message, MessageEmbed } from 'discord.js';

export default class Rule34Slash extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'rule34',
            description: 'Search for a rule34 image',
            commandOptions: [
                {
                    name: 'tags',
                    description: 'Tags to search for',
                    type: 3,
                    required: true,
                },
            ],
        });
    }
    public override async execute(
        interaction: CommandInteraction<CacheType>,
        args: { tags: string }
    ) {
        const images = await search('rule34', args.tags.split(/\s+/g), {
            limit: 1,
            random: true,
        });
        if (images.length === 0) {
            const msg = await interaction.reply({
                content: interaction.guild?.i18n.__mf('rule34.no_results', {
                    query: args.tags,
                }) as string,
                fetchReply: true,
            });
            setTimeout(
                () => (msg instanceof Message ? void msg.delete() : null),
                3000
            );
            return;
        }
        if (
            (args.tags.includes('loli') || args.tags.includes('shota')) &&
            !this.client.isOwner(interaction.user)
        )
            return interaction.reply(
                interaction.guild?.i18n.__mf('rule34.pedo') as string
            );
        const [image] = images;
        if (!image) return;
        const embed = new MessageEmbed()
            .setAuthor(
                'Rule34',
                'https://gtswiki.gt-beginners.net/decal/png/04/87/77/6927195936641778704_1.png',
                image.fileUrl as string
            )
            .setDescription(
                `・ ${interaction.guild?.i18n.__mf('rule34.rating_score', {
                    rating: image.rating,
                    score: image.score,
                })}`
            )
            .setImage(image.fileUrl ?? image.file_url ?? image.previewUrl ?? '')
            .setColor('#FF0000')
            .setFooter(
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                interaction.guild?.i18n.__mf('rule34.tags') +
                    trimArray(image.tags, { maxLength: 2000 }).join(' | ')
            );
        await interaction.reply({ embeds: [embed] });
    }
}
