import SlashCommand from '../../struct/SlashCommand';
import type KiwiiClient from '../../struct/Client';
import type { CommandInteraction } from 'discord.js';
import malScraper from 'mal-scraper';
import { MessageActionRow, MessageSelectMenu, MessageEmbed } from 'discord.js';
import child from 'child_process';
import type { ExecException } from 'child_process';
import { parseDate } from '../../util/string';

export default class AnimeSlashCommand extends SlashCommand {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'anime',
            description: 'Anime search',
            commandOptions: [
                {
                    name: 'search',
                    description: 'Search for an anime',
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public override async execute(
        interaction: CommandInteraction,
        { search }: { search: string }
    ): Promise<void | string> {
        interaction.deferReply();
        if (!interaction.guild) return;
        search = search.toLowerCase();
        const result = await malScraper.getResultsFromSearch(search).catch(
            async () =>
                await interaction.reply(
                    interaction.guild
                        ? interaction.guild.i18n.__mf('anime.not_found', {
                              search,
                          })
                        : 'Anime not found'
                )
        );
        if (!result)
            return await interaction.reply(
                interaction.guild.i18n.__mf('anime.not_found', {
                    search,
                })
            );
        if (result.length > 2) {
            const res = result.map((r, i) => ({
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                label: `${i + 1} - ${r.name}`,
                value: `${i}`,
            }));
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('anime')
                    .setPlaceholder('Select an anime')
                    .addOptions(res)
            );

            const collector =
                interaction.channel?.createMessageComponentCollector({
                    filter: (m) => {
                        m.deferUpdate();
                        return m.user.id === interaction.user.id;
                    },
                    componentType: 'SELECT_MENU',
                    time: 60000,
                });

            interaction.editReply({
                components: [row],
                content: interaction.guild.i18n.__mf('anime.choose'),
            });

            collector?.on('collect', async (i) => {
                if (!interaction.guild) return;
                if (i.customId === 'anime') {
                    const value = Number(i.values[0]);
                    const _anime = result[value];
                    if (!_anime)
                        return void interaction.editReply(
                            interaction.guild.i18n.__mf('anime.not_found', {
                                search,
                            })
                        );
                    const anime = await malScraper.getInfoFromName(_anime.name);

                    const [startDate, endDate] = anime.aired?.split('to') ?? [
                        'N/A',
                        'N/A',
                    ];
                    let synopsis = anime.synopsis?.replace(
                        '[Written by MAL Rewrite]',
                        ''
                    );
                    if (interaction.guild.i18n.getLocale() === 'en') {
                        synopsis =
                            anime.synopsis?.replace(
                                '[Written by MAL Rewrite]',
                                ''
                            ) ?? 'N/A';
                    } else {
                        const stdout = await this.exec(
                            `python ./src/util/deepl.py en ${interaction.guild.i18n.getLocale()} "${synopsis}"`
                        );
                        synopsis = stdout.toString('binary');
                    }

                    const embed = new MessageEmbed()
                        .setColor('#FF2050')
                        .setAuthor(
                            `${anime.title} | ${_anime.payload?.media_type}`,
                            _anime.thumbnail_url,
                            anime.url
                        );
                    if (anime.synopsis && anime.synopsis.length < 2000)
                        embed.setDescription(synopsis);

                    embed
                        .addField(
                            '❯\u2000 Informations',
                            `•\u2000 **${interaction.guild.i18n.__mf(
                                'anime.japanese_name'
                            )}** ${
                                anime.title
                            }\n•\u2000 **${interaction.guild.i18n.__mf(
                                'anime.age'
                            )}** ${anime.rating}\n•\u2000 **NSFW:** ${
                                anime.rating === 'Rx - Hentai'
                                    ? interaction.guild.i18n.__mf('common.yes')
                                    : interaction.guild.i18n.__mf('common.no')
                            }`,
                            true
                        )
                        .addField(
                            `❯\u2000 ${interaction.guild?.i18n.__mf(
                                'anime.stats'
                            )}`,
                            `•\u2000 **${interaction.guild?.i18n.__mf(
                                'anime.note'
                            )}** ${
                                anime.score
                            }\n•\u2000 **${interaction.guild?.i18n.__mf(
                                'anime.rank'
                            )}** ${
                                anime.ranked
                            }\n•\u2000 **${interaction.guild?.i18n.__mf(
                                'anime.poularity'
                            )}** ${anime.popularity}`,
                            true
                        )
                        .addField(
                            '❯\u2000 Status',
                            `•\u2000 **Episodes:** ${
                                anime.episodes ? anime.episodes : 'N/A'
                            }\n•\u2000 **${interaction.guild.i18n.__mf(
                                'anime.beginning'
                            )}:** ${parseDate(
                                startDate?.trim() ?? 'Jan, 01 1900',
                                true
                            ).replace(
                                /-/g,
                                '/'
                            )}\n•\u2000 **${interaction.guild?.i18n.__mf(
                                'anime.end'
                            )}:** ${
                                endDate?.trim() === '?'
                                    ? interaction.guild.i18n.__mf(
                                          'anime.in_progress'
                                      )
                                    : parseDate(
                                          endDate?.trim() ?? 'Jan, 01 1900',
                                          true
                                      ).replace(/-/g, '/')
                            }`,
                            true
                        )
                        .setThumbnail(
                            anime.picture ?? _anime.thumbnail_url ?? ''
                        );
                    await interaction.editReply({
                        content: '\u200b',
                        embeds: [embed],
                        components: [],
                    });
                }
            });
        }
    }

    public exec(command: string): Promise<ExecException | Buffer> {
        return new Promise((resolve, reject) => {
            child.exec(
                command,
                { encoding: 'buffer' },
                (error, stdout, stderr) => {
                    if (error) reject(error);
                    if (stderr.length) reject(stderr);
                    resolve(stdout);
                }
            );
        });
    }
}
