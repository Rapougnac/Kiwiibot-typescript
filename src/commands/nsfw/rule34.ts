import { BooruError, search } from 'booru';
import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import { trimArray } from '../../util/string';
import { MessageEmbed, Message } from 'discord.js';

export default class Rule34Command extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'rule34',
            aliases: [
                'r34',
                'rulethirtyfour',
                'rulethirtyfor',
                'rule-thirty-four',
            ],
            description: 'Scrap images from the rule34 site',
            category: 'nsfw',
            utilisation: '{prefix}rule34 [...tags]',
            nsfw: true,
        });
    }

    public execute(
        client: KiwiiClient,
        message: Message,
        query: string[]
    ): void | Promise<Message> {
        query = query.map((q) => q.toLowerCase());
        if (query.length === 0)
            return message.channel.send(
                message.guild?.i18n.__mf('rule34.no_tags_provided') as string
            );
        search('rule34', query, { limit: 1, random: true })
            .then(async (images) => {
                if (images.length === 0) {
                    const msg = await message.channel.send(
                        message.guild?.i18n.__mf('rule34.no_results', {
                            query: query.join(' '),
                        }) as string
                    );
                    setTimeout(() => void msg.delete(), 3000);
                }
                if (
                    (query.includes('loli') || query.includes('shota')) &&
                    !client.isOwner(message.author)
                )
                    return message.channel.send(
                        message.guild?.i18n.__mf('rule34.pedo') as string
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
                        `・ ${message.guild?.i18n.__mf('rule34.rating_score', {
                            rating: image.rating,
                            score: image.score,
                        })}`
                    )
                    .setImage(
                        image.fileUrl ??
                            image.file_url ??
                            image.previewUrl ??
                            ''
                    )
                    .setColor('#FF0000')
                    .setFooter(
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        message.guild?.i18n.__mf('rule34.tags') +
                            trimArray(image.tags, { maxLength: 2000 }).join(
                                ' | '
                            )
                    );
                await message.channel.send({ embeds: [embed] });
            })
            .catch(async (err) => {
                if (err instanceof BooruError)
                    return await message.channel.send(
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        message.guild?.i18n.__mf('rule34.no_results_err', {
                            query,
                        }) + err.message
                    );
                else
                    return await message.channel.send(
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        message.guild?.i18n.__mf('rule34.no_results_err', {
                            query: query,
                        }) + err
                    );
            });
    }
}
