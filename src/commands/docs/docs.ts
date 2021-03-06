import type { Message } from 'discord.js';
import Command from '../../struct/Command';
import type KiwiiClient from '../../struct/Client';
import axios from 'axios';

export default class DocsCommand extends Command {
  constructor(client: KiwiiClient) {
    super(client, {
      name: 'docs',
      aliases: ['doc', 'documentation'],
      description:
        'Get the djs docs in an embed, you can specify the source by doing `--src {source}` (without the brackets) The sources are listed here: `stable`, `master`, `commando`, `rpc`, `akairo`, `akairo-master` and `collection`',
      category: 'docs',
      utilisation: '{prefix}docs [query] <--src> <[source]>',
      img: 'https://image.flaticon.com/icons/png/512/2015/2015058.png',
    });
  }

  public async execute(
    _client: KiwiiClient,
    message: Message,
    args: string[]
  ): Promise<Message | void> {
    if (!message.guild) return;
    const sources = [
      'stable',
      'master',
      'commando',
      'rpc',
      'akairo',
      'akairo-master',
      'collection',
    ];
    const query = args.join(' ').split(/ +--src/g)[0];
    if (!query)
      return message.channel.send(
        message.guild.i18n.__mf('docs.missing_query')
      );
    let source;
    if (message.content.includes('--src')) {
      source = args[args.length - 1];
      if (sources.indexOf(source ?? '') === -1)
        return message.channel.send(
          message.guild.i18n.__mf('docs.valid_sources')
        );
      const url = `https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${encodeURIComponent(
        query
      )}`;
      axios
        .get(url)
        .then(async ({ data }) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (data) await message.channel.send({ embeds: [data] });
          else
            return await message.channel.send(
              message.guild?.i18n.__mf('docs.docs_fetch_error') ?? ''
            );
        })
        .catch(() => []);
    } else {
      source = 'stable';
      const url = `https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${encodeURIComponent(
        query
      )}`;
      axios
        .get(url)
        .then(async ({ data }) => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (data) {
            await message.channel.send({ embeds: [data] });
          } else {
            return message.channel.send(
              message.guild?.i18n.__mf('docs.docs_fetch_error') ?? ''
            );
          }
        })
        .catch(() => []);
    }
  }
}
