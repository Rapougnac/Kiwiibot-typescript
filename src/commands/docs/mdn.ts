import Command from '../../struct/Command';
import KiwiiClient from '../../struct/Client';
import mdn from '@xelzs/mdn-browser-compat-api';
import { IdentifierMeta } from '@mdn/browser-compat-data/types';
import { Message, MessageEmbed } from 'discord.js';
import { upperFirstButAcceptEmojis } from '../../util/string';
import cheerio from 'cheerio';
import axios from 'axios';

export default class MDNCommand extends Command {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'mdn',
            description: 'Search in the mdn docs',
            category: 'docs',
            utilisation: '{prefix}mdn [query]',
            img: 'https://avatars.githubusercontent.com/u/7565578?s=1000&v=4',
        });
    }
    public async execute(
        _client: KiwiiClient,
        message: Message,
        args: string[]
    ): Promise<Message<boolean> | undefined> {
        if (!message.guild) return;
        const word = args.join('.');
        const arrayOfProperties =
            mdn.find(upperFirstButAcceptEmojis(word), 'javascript').length === 0
                ? mdn.find(word, 'javascript')
                : mdn.find(upperFirstButAcceptEmojis(word), 'javascript');
        const notFound =
            message.guild?.i18n.__mf('mdn.not_found') ??
            'Your query was not found!';
        if (!arrayOfProperties) return message.channel.send(notFound);
        let foo: IdentifierMeta | null = null;
        if (
            Object.prototype.hasOwnProperty.call(
                mdn.get(arrayOfProperties[0] ?? '')[0],
                arrayOfProperties[0] ?? ''
            )
        ) {
            foo = mdn.get(arrayOfProperties[0] ?? '')[0]?.[
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                arrayOfProperties[0] as any
            ] as IdentifierMeta;
        }
        if (!foo) return message.channel.send(notFound);
        const _url = foo.__compat?.mdn_url ?? '';
        // Get the domain of mdn (https://developer.mozilla.org/)
        const domain = _url.substring(0, 30);
        // Here we get the url of the page
        const [, path] = _url.split(domain ?? 'https://developer.mozilla.org/');
        const locale = message.guild.i18n.getLocale();
        let url = _url;
        // Set the url to the locale if it exists
        if (locale === 'en') {
            url = `${domain}${locale}-US/${path}`;
        } else if (locale === 'fr') {
            url = `${domain}${locale}/${path}`;
        }
        const html = await axios.get(url).then((res) => res.data);
        if (!html) return;
        const $ = cheerio.load(html);
        const reg = /`?<a\shref="([^"]*)">([^<]*)<\/a>`?/im;
        // Look for the first `p` tag (the description)
        let description = $('p')
            .first()
            .html()
            ?.replace(/<[^>]*code>/g, '`')
            .replace(/<[^>]*strong>/g, '**')
            .replace(/&nbsp;/g, ' ')
            .replace(/<[^>]*em>/g, '_');
        const title = $('h1').first().text();
        const element = cheerio.load(description ?? '');
        // Set the arrays that will contains the contentLinks and the links
        const contentLinks: string[] = [];
        const _links: string[] = [];
        // Get all the links in the description
        element('a').each(function () {
            const fallRegex =
                /<a\s(?:href="([^"]*)")?(?:\s)?class="([^"]*)"\stitle="([^"]*)">([^<]*)<\/a>/im;
            const text = element(this).text();
            const l = element(this).attr('href') ?? '';
            const f = element(this).attr('class') ?? '';

            if (f === 'page-not-created')
                description = description?.replace(fallRegex, '$4');

            contentLinks.push(text);
            _links.push(l);
        });
        let links = _links.map((li) => domain.slice(0, -1) + li);
        links = links.map((li, i) => {
            // If the <a> tag contains "`" AND the content link contains "`", replace it by nothing
            if (
                contentLinks[i]?.[0] === '`' &&
                contentLinks[i]?.[(contentLinks[i]?.length ?? 0) - 1] === '`' &&
                description?.[description?.indexOf('<a') - 1] === '`' &&
                description?.[description?.indexOf('</a>') + 1] === '`'
            )
                contentLinks[i] = contentLinks[i]?.replace(/`/g, '') ?? '';
            return `[${contentLinks[i]}](${li})`;
        });
        links.forEach((link) => {
            // Replace HTML hyperlinks by markdown hyperlinks
            description = description?.replace(reg, link);
        });
        if (!description) description = foo.__compat?.description;
        const yes = message.guild?.i18n.__mf('common.yes'),
            no = message.guild?.i18n.__mf('common.no');
        const embed = new MessageEmbed()
            .setTitle(message.guild.i18n.__mf('mdn.doc', { val: title }))
            .setDescription(String(description))
            .setURL(url)
            .setImage(
                'https://developer.mozilla.org/mdn-social-share.0ca9dbda.png'
            )
            .addField(
                message.guild.i18n.__mf('mdn.experimental'),
                String(
                    foo.__compat?.status?.experimental
                        ? message.guild?.i18n.__mf('mdn.experimental_desc', {
                              value: yes,
                          })
                        : message.guild.i18n.__mf('mdn.experimental_desc', {
                              value: no,
                          })
                )
            )
            .addField(
                message.guild.i18n.__mf('mdn.deprecated'),
                foo.__compat?.status?.deprecated
                    ? message.guild.i18n.__mf('mdn.deprecated_desc', {
                          value: yes,
                      })
                    : message.guild.i18n.__mf('mdn.deprecated_desc', {
                          value: no,
                      })
            );
        message.channel.send({ embeds: [embed] });
    }
}
