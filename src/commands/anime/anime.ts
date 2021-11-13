import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../struct/Command';
import malScraper from 'mal-scraper';
import KiwiiClient from '../../struct/Client';
import moment from 'moment';
import { parseDate } from '../../util/string';
export default class AnimeCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'anime',
            aliases: [],
            description: 'Get informations about the specified anime',
            category: 'anime',
            cooldown: 10,
            utilisation: '{prefix}anime [anime]',
            img: 'https://cdn-icons-png.flaticon.com/512/949/949549.png',
        });
    }

    public async execute(
        client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<Message | undefined> {
        const search = args.join(' ').toLowerCase();
        if (!search) {
            return message.channel.send(
                message.guild!.i18n.__mf('anime.specify')
            );
        }
        const result = await malScraper
            .getResultsFromSearch(search)
            .catch((err) => {
                console.error(err.stack);
                return message.channel.send(
                    message.guild!.i18n.__mf('anime.not_found', {
                        search: search,
                    })
                );
            });
        if (result instanceof Message) return;
        if (result.length === 0) {
            return message.channel.send(
                message.guild!.i18n.__mf('anime.not_found', {
                    search: search,
                })
            );
        }
        if (result.length > 2) {
            let s = '';
            result.forEach(
                (ani, count) => (s += `**${count + 1}** - ${ani.name}\n`)
            );
            await message.channel.send({
                embeds: [
                    {
                        author: {
                            name: message.guild!.i18n.__mf(
                                'anime.stop_collect_msg'
                            ),
                        },
                        title: message.guild!.i18n.__mf('anime.choose'),
                        description: s,
                        footer: {
                            text: `Requested by ${message.author.username}`,
                            icon_url: message.author.displayAvatarURL({
                                dynamic: true,
                            }),
                        },
                    },
                ],
            });

            const filter = (m: Message): boolean =>
                message.author.id === m.author.id &&
                m.channel.id === message.channel.id;
            const collector = message.channel.createMessageCollector({
                filter,
                max: 1,
                time: 60000,
            });
            let number;
            const continued = await new Promise((resolve) => {
                let count: number;
                collector
                    .on('collect', async (m) => {
                        const arg = m.content.toLowerCase().trim().split(/ +/g);
                        number = Number(arg[0]);
                        if (Number.isNaN(number) || !number) resolve(false);
                        result.forEach((_, index) => (count = index + 1));
                        if (number >= 1 && number < count) resolve(true);
                        else return resolve(false);
                    })
                    .on('end', () => resolve(false));
            });
            let c;
            result.forEach((_, index) => (c = index + 1));
            if (!continued)
                return message.channel.send(
                    message.guild!.i18n.__mf('anime.number_range', {
                        number: c,
                    })
                );
            else {
                const _anime = result[(number ?? 1) - 1];
                const anime = await malScraper.getInfoFromName(_anime.name);
                const [startDate, endDate] = anime.aired?.split('to') ?? [
                    'N/A',
                    'N/A',
                ];
                const embed = new MessageEmbed()
                    .setColor('#FF2050')
                    .setAuthor(
                        `${anime.title} | ${_anime.payload?.media_type}`,
                        _anime.thumbnail_url,
                        anime.url
                    );
                if (anime.synopsis && anime.synopsis.length < 2000)
                    embed.setDescription(anime.synopsis);

                embed
                    .addField(
                        '❯\u2000 Informations',
                        `•\u2000 **${message.guild!.i18n.__mf(
                            'anime.japanese_name'
                        )}** ${
                            anime.title
                        }\n•\u2000 **${message.guild!.i18n.__mf(
                            'anime.age'
                        )}** ${anime.rating}\n•\u2000 **NSFW:** ${
                            anime.rating === 'Rx - Hentai'
                                ? message.guild!.i18n.__mf('common.yes')
                                : message.guild!.i18n.__mf('common.no')
                        }`,
                        true
                    )
                    .addField(
                        `❯\u2000 ${message.guild!.i18n.__mf('anime.stats')}`,
                        `•\u2000 **${message.guild!.i18n.__mf(
                            'anime.note'
                        )}** ${
                            anime.score
                        }\n•\u2000 **${message.guild!.i18n.__mf(
                            'anime.rank'
                        )}** ${
                            anime.ranked
                        }\n•\u2000 **${message.guild!.i18n.__mf(
                            'anime.poularity'
                        )}** ${anime.popularity}`,
                        true
                    )
                    .addField(
                        '❯\u2000 Status',
                        `•\u2000 **Episodes:** ${
                            anime.episodes ? anime.episodes : 'N/A'
                        }\n•\u2000 **${message.guild!.i18n.__mf(
                            'anime.beginning'
                        )}:** ${parseDate(startDate.trim(), true).replace(
                            /-/g,
                            '/'
                        )}\n•\u2000 **${message.guild!.i18n.__mf(
                            'anime.end'
                        )}:** ${
                            endDate.trim() === '?'
                                ? message.guild!.i18n.__mf('anime.in_progress')
                                : parseDate(endDate.trim(), true).replace(
                                      /-/g,
                                      '/'
                                  )
                        }`,
                        true
                    )
                    .setThumbnail(anime.picture ?? _anime.thumbnail_url ?? '');

                return message.channel.send({ embeds: [embed] });
            }
        } else {
            const _anime = result[0];
            const anime = await malScraper.getInfoFromName(_anime.name);
            const [startDate, endDate] = anime.aired?.split('to') ?? [
                'N/A',
                'N/A',
            ];
            const embed = new MessageEmbed()
                .setColor('#FF2050')
                .setAuthor(
                    `${anime.title} | ${_anime.payload?.media_type}`,
                    _anime.thumbnail_url,
                    anime.url
                );
            if (anime.synopsis && anime.synopsis.length < 2000)
                embed.setDescription(anime.synopsis);

            embed
                .addField(
                    '❯\u2000 Informations',
                    `•\u2000 **${message.guild!.i18n.__mf(
                        'anime.japanese_name'
                    )}** ${anime.title}\n•\u2000 **${message.guild!.i18n.__mf(
                        'anime.age'
                    )}** ${anime.rating}\n•\u2000 **NSFW:** ${
                        anime.rating === 'Rx - Hentai'
                            ? message.guild!.i18n.__mf('common.yes')
                            : message.guild!.i18n.__mf('common.no')
                    }`,
                    true
                )
                .addField(
                    `❯\u2000 ${message.guild!.i18n.__mf('anime.stats')}`,
                    `•\u2000 **${message.guild!.i18n.__mf('anime.note')}** ${
                        anime.score
                    }\n•\u2000 **${message.guild!.i18n.__mf('anime.rank')}** ${
                        anime.ranked
                    }\n•\u2000 **${message.guild!.i18n.__mf(
                        'anime.poularity'
                    )}** ${anime.popularity}`,
                    true
                )
                .addField(
                    '❯\u2000 Status',
                    `•\u2000 **Episodes:** ${
                        anime.episodes ? anime.episodes : 'N/A'
                    }\n•\u2000 **${message.guild!.i18n.__mf(
                        'anime.beginning'
                    )}:** ${parseDate(startDate.trim(), true).replace(
                        /-/g,
                        '/'
                    )}\n•\u2000 **${message.guild!.i18n.__mf('anime.end')}:** ${
                        endDate.trim() === '?'
                            ? message.guild!.i18n.__mf('anime.in_progress')
                            : parseDate(endDate.trim(), true).replace(/-/g, '/')
                    }`,
                    true
                )
                .setThumbnail(anime.picture ?? _anime.thumbnail_url ?? '');

            return message.channel.send({ embeds: [embed] });
        }
    }
}
