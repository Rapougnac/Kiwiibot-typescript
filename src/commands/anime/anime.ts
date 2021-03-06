import { Message, MessageEmbed } from 'discord.js';
import Command from '../../struct/Command';
import malScraper from 'mal-scraper';
import type KiwiiClient from '../../struct/Client';
import { parseDate } from '../../util/string';

import type { ExecException } from 'child_process';
import child from 'child_process';
// import util from 'util';
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
      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
    });
  }

  public async execute(
    _client: KiwiiClient,
    message: Message,
    args: string[]
  ): Promise<Message | undefined> {
    const search = args.join(' ').toLowerCase();
    if (!search) {
      return message.channel.send(
        message.guild?.i18n.__mf('anime.specify') ?? 'Specify an anime'
      );
    }
    const result = await malScraper
      .getResultsFromSearch(search)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err.stack);
        return message.channel.send(
          message.guild?.i18n.__mf('anime.not_found', {
            search: search,
          }) ?? 'Anime not found'
        );
      });
    if (result instanceof Message) return;
    if (result.length === 0) {
      return message.channel.send(
        message.guild?.i18n.__mf('anime.not_found', {
          search: search,
        }) ?? 'Placeholder'
      );
    }
    if (result.length > 2) {
      let s = '';
      result.forEach((ani, count) => (s += `**${count + 1}** - ${ani.name}\n`));
      await message.channel.send({
        embeds: [
          {
            author: {
              name: message.guild?.i18n.__mf('anime.stop_collect_msg'),
            },
            title: message.guild?.i18n.__mf('anime.choose'),
            description: s,
            footer: {
              text: `Requested by ${message.author.username}`,
              // eslint-disable-next-line camelcase
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
          .on('collect', (m) => {
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
          message.guild?.i18n.__mf('anime.number_range', {
            number: c,
          }) ?? 'Number out of range'
        );
      else {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const _anime = result[(number ?? 1) - 1];
        if (!_anime)
          return message.channel.send(
            message.guild?.i18n.__mf('anime.not_found', {
              search: search,
            }) ?? 'Anime not found'
          );
        const anime = await malScraper.getInfoFromName(_anime.name);
        const [startDate, endDate] = anime.aired?.split('to') ?? ['N/A', 'N/A'];
        let synopsis = anime.synopsis?.replace('[Written by MAL Rewrite]', '');
        if (message.guild?.i18n.getLocale() === 'en') {
          synopsis =
            anime.synopsis?.replace('[Written by MAL Rewrite]', '') ?? 'N/A';
        } else {
          const stdout = await this.exec(
            `python ./src/util/deepl.py en ${message.guild?.i18n.getLocale()} "${synopsis}"`
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
            '???\u2000 Informations',
            `???\u2000 **${message.guild?.i18n.__mf('anime.japanese_name')}** ${
              anime.title
            }\n???\u2000 **${message.guild?.i18n.__mf('anime.age')}** ${
              anime.rating
            }\n???\u2000 **NSFW:** ${
              anime.rating === 'Rx - Hentai'
                ? message.guild?.i18n.__mf('common.yes')
                : message.guild?.i18n.__mf('common.no')
            }`,
            true
          )
          .addField(
            `???\u2000 ${message.guild?.i18n.__mf('anime.stats')}`,
            `???\u2000 **${message.guild?.i18n.__mf('anime.note')}** ${
              anime.score
            }\n???\u2000 **${message.guild?.i18n.__mf('anime.rank')}** ${
              anime.ranked
            }\n???\u2000 **${message.guild?.i18n.__mf('anime.poularity')}** ${
              anime.popularity
            }`,
            true
          )
          .addField(
            '???\u2000 Status',
            `???\u2000 **Episodes:** ${
              anime.episodes ? anime.episodes : 'N/A'
            }\n???\u2000 **${message.guild?.i18n.__mf(
              'anime.beginning'
            )}:** ${parseDate(
              startDate?.trim() ?? 'Jan, 01 1900',
              true
            ).replace(/-/g, '/')}\n???\u2000 **${message.guild?.i18n.__mf(
              'anime.end'
            )}:** ${
              endDate?.trim() === '?'
                ? message.guild?.i18n.__mf('anime.in_progress')
                : parseDate(endDate?.trim() ?? 'Jan, 01 19000', true).replace(
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
      if (!_anime)
        return message.channel.send(
          message.guild?.i18n.__mf('anime.not_found', {
            search: search,
          }) ?? 'Anime not found'
        );
      const anime = await malScraper.getInfoFromName(_anime.name);
      const [startDate, endDate] = anime.aired?.split('to') ?? ['N/A', 'N/A'];
      let synopsis = anime.synopsis?.replace('[Written by MAL Rewrite]', '');
      const python = child.execSync(
        `python ./src/util/deepl.py en ${message.guild?.i18n.getLocale()} "${synopsis}"`
      );
      if (message.guild?.i18n.getLocale() === 'en') {
        synopsis = anime.synopsis?.replace('[Written by MAL Rewrite]', '');
      } else {
        synopsis = python.toString('binary');
      }
      const embed = new MessageEmbed()
        .setColor('#FF2050')
        .setAuthor(
          `${anime.title} | ${_anime.payload?.media_type}`,
          _anime.thumbnail_url,
          anime.url
        );
      if (anime.synopsis && anime.synopsis.length < 2000)
        embed.setDescription(synopsis ?? 'N/A');

      embed
        .addField(
          '???\u2000 Informations',
          `???\u2000 **${message.guild?.i18n.__mf('anime.japanese_name')}** ${
            anime.title
          }\n???\u2000 **${message.guild?.i18n.__mf('anime.age')}** ${
            anime.rating
          }\n???\u2000 **NSFW:** ${
            anime.rating === 'Rx - Hentai'
              ? message.guild?.i18n.__mf('common.yes')
              : message.guild?.i18n.__mf('common.no')
          }`,
          true
        )
        .addField(
          `???\u2000 ${message.guild?.i18n.__mf('anime.stats')}`,
          `???\u2000 **${message.guild?.i18n.__mf('anime.note')}** ${
            anime.score
          }\n???\u2000 **${message.guild?.i18n.__mf('anime.rank')}** ${
            anime.ranked
          }\n???\u2000 **${message.guild?.i18n.__mf('anime.poularity')}** ${
            anime.popularity
          }`,
          true
        )
        .addField(
          '???\u2000 Status',
          `???\u2000 **Episodes:** ${
            anime.episodes ? anime.episodes : 'N/A'
          }\n???\u2000 **${message.guild?.i18n.__mf(
            'anime.beginning'
          )}:** ${parseDate(startDate?.trim() ?? 'Jan, 01 1900', true).replace(
            /-/g,
            '/'
          )}\n???\u2000 **${message.guild?.i18n.__mf('anime.end')}:** ${
            endDate?.trim() === '?'
              ? message.guild?.i18n.__mf('anime.in_progress')
              : parseDate(endDate?.trim() ?? 'Jan, 01 1900', true).replace(
                  /-/g,
                  '/'
                )
          }`,
          true
        )
        .setThumbnail(anime.picture ?? _anime.thumbnail_url ?? '');

      return message.channel.send({ embeds: [embed] });
    }
  }

  public exec(command: string): Promise<ExecException | Buffer> {
    return new Promise((resolve, reject) => {
      child.exec(command, { encoding: 'buffer' }, (error, stdout, stderr) => {
        if (error) reject(error);
        if (stderr.length) reject(stderr);
        resolve(stdout);
      });
    });
  }
}
