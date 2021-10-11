import { Message, MessageEmbed, MessageAttachment } from 'discord.js';
import Command from '../../struct/Command';
//@ts-ignore
import Kitsu from 'kitsu.js';
import { dropRight } from 'lodash';
import KiwiiClient from '../../struct/Client';

export default class AnimeCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'anime',
            aliases: [],
            description: 'Get informations about the specified anime',
            category: 'anime',
            cooldown: 10,
            utilisation: '{prefix}anime [anime]',
        });
    }

    public async execute(client: KiwiiClient, message: Message, args: string[]) {
        const kitsu = new Kitsu();
        const search = args.join(' ').toLowerCase();
        if (!search) {
            return message.channel.send(
                message.guild!.i18n.__mf('anime.specify')
            );
        }
        kitsu
            .searchAnime(search)
            .then(async (result: any) => {
                if (result.length === 0) {
                    return message.channel.send(
                        message.guild!.i18n.__mf('anime.not_found', {
                            search: search,
                        })
                    );
                }
                if (result.length > 2) {
                    const x = dropRight(result, result.length - 20);
                    let string = String();
                    x.forEach((ani: any, count) => {
                        string += `**${count + 1}** - ${
                            ani.titles.english
                                ? ani.titles.english
                                : ani.titles.abbreviated[0]
                        }\n`;
                    });
                    await message.channel.send({
                        embed: {
                            author: {
                                name: message.guild!.i18n.__mf(
                                    'anime.stop_collect_msg'
                                ),
                            },
                            title: message.guild!.i18n.__mf('anime.choose'),
                            description: string,
                            footer: {
                                text: `Requested by ${message.author.username}`,
                                icon_url: message.author.displayAvatarURL({
                                    dynamic: true,
                                }),
                            },
                        },
                    });

                    const filter = (m: Message): boolean =>
                        message.author.id === m.author.id &&
                        m.channel.id === message.channel.id;
                    const collector = message.channel.createMessageCollector(
                        filter,
                        {
                            max: 1,
                            time: 60000,
                        }
                    );
                    let number;
                    const continued = await new Promise((resolve) => {
                        let count: number;
                        collector
                            .on('collect', async (m) => {
                                const arg = m.content
                                    .toLowerCase()
                                    .trim()
                                    .split(/ +/g);
                                number = Number(arg[0]);
                                x.forEach(
                                    (y, counter) => (count = counter + 1)
                                );
                                if (number >= 1 && number <= count) {
                                    resolve(true);
                                } else {
                                    return resolve(false);
                                }
                            })
                            .on('end', () => resolve(false));
                    });
                    let c;
                    x.forEach((y, counter) => (c = counter + 1));
                    if (!continued)
                        return message.channel.send(
                            message.guild!.i18n.__mf('anime.number_range', {
                                number: c,
                            })
                        );
                    else {
                        const anime: any = x[(number as unknown as number) - 1];
                        const embed = new MessageEmbed()
                            .setColor('#FF2050')
                            .setAuthor(
                                `${
                                    anime.titles.english
                                        ? anime.titles.english
                                        : anime.titles.abbreviated[0]
                                } | ${anime.showType}`,
                                anime.posterImage.original,
                                anime.url
                            )
                            .setDescription(anime.synopsis);
                        if (anime.synopsis.length < 2000)
                            embed
                                .setDescription(
                                    anime.synopsis
                                        .replace(/<[^>]*>/g, '')
                                        .split('\n')[0]
                                )

                                .addField(
                                    '❯\u2000 Informations',
                                    `•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.japanese_name'
                                    )}** ${
                                        anime.titles.romaji
                                    }\n•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.age'
                                    )}** ${
                                        anime.ageRatingGuide
                                    }\n•\u2000 **NSFW:** ${
                                        anime.nsfw
                                            ? message.guild!.i18n.__mf(
                                                  'common.yes'
                                              )
                                            : message.guild!.i18n.__mf(
                                                  'common.no'
                                              )
                                    }`,
                                    true
                                )
                                .addField(
                                    `❯\u2000 ${message.guild!.i18n.__mf(
                                        'anime.stats'
                                    )}`,
                                    `•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.note'
                                    )}** ${
                                        anime.averageRating
                                    }\n•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.rank'
                                    )}** ${
                                        anime.ratingRank
                                    }\n•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.poularity'
                                    )}** ${anime.popularityRank}`,
                                    true
                                )
                                .addField(
                                    '❯\u2000 Status',
                                    `•\u2000 **Episodes:** ${
                                        anime.episodeCount
                                            ? anime.episodeCount
                                            : 'N/A'
                                    }\n•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.beginning'
                                    )}:** ${
                                        anime.startDate
                                    }\n•\u2000 **${message.guild!.i18n.__mf(
                                        'anime.end'
                                    )}:** ${
                                        anime.endDate
                                            ? anime.endDate
                                            : message.guild!.i18n.__mf(
                                                  'anime.in_progress'
                                              )
                                    }`,
                                    true
                                )
                                .setThumbnail(anime.posterImage.original);

                        return message.channel.send(embed);
                    }
                } else {
                    const anime = result[0];

                    const embed = new MessageEmbed()
                        .setColor('#FF2050')
                        .setAuthor(
                            `${
                                anime.titles.english
                                    ? anime.titles.english
                                    : anime.titles.abbreviated[0]
                            } | ${anime.showType}`,
                            anime.posterImage.original,
                            anime.url
                        )
                        .setDescription(anime.synopsis);
                    if (anime.synopsis.length < 2000)
                        embed
                            .setDescription(
                                anime.synopsis
                                    .replace(/<[^>]*>/g, '')
                                    .split('\n')[0]
                            )
                            .addField(
                                '❯\u2000 Informations',
                                `•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.japanese_name'
                                )}** ${
                                    anime.titles.romaji
                                }\n•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.age'
                                )}** ${
                                    anime.ageRatingGuide
                                }\n•\u2000 **NSFW:** ${
                                    anime.nsfw
                                        ? message.guild!.i18n.__mf('anime.yes')
                                        : message.guild!.i18n.__mf('anime.no')
                                }`,
                                true
                            )
                            .addField(
                                `❯\u2000 ${message.guild!.i18n.__mf(
                                    'anime.stats'
                                )}`,
                                `•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.note'
                                )}** ${
                                    anime.averageRating
                                }\n•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.rank'
                                )}** ${
                                    anime.ratingRank
                                }\n•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.popularity'
                                )}** ${anime.popularityRank}`,
                                true
                            )
                            .addField(
                                '❯\u2000 Status',
                                `•\u2000 **Episodes:** ${
                                    anime.episodeCount
                                        ? anime.episodeCount
                                        : 'N/A'
                                }\n•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.beginning'
                                )}** ${
                                    anime.startDate
                                }\n•\u2000 **${message.guild!.i18n.__mf(
                                    'anime.end'
                                )}** ${
                                    anime.endDate
                                        ? anime.endDate
                                        : message.guild!.i18n.__mf(
                                              'anime.in_progress'
                                          )
                                }`,
                                true
                            )
                            .setThumbnail(anime.posterImage.original);

                    return message.channel.send(embed);
                }
            })
            .catch((err: any) => {
                console.error(err.stack); //catching error
                return message.channel.send(
                    message.guild!.i18n.__mf('anime.not_found', {
                        search: search,
                    })
                );
            });
    }
}
