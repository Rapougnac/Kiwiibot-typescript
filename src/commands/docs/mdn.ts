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
        client: KiwiiClient,
        message: Message,
        args: string[]
    ) {
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
                mdn.get(arrayOfProperties[0])[0],
                arrayOfProperties[0]
            )
        ) {
            foo = mdn.get(arrayOfProperties[0])[0][
                arrayOfProperties[0] as any
            ] as IdentifierMeta;
        }
        if (!foo) return message.channel.send(notFound);
        const _url = foo.__compat?.mdn_url ?? '';
        const domain = _url.substring(0, 30);
        const path = _url.split(domain ?? 'https://developer.mozilla.org/')[1];
        const locale = message.guild!.i18n.getLocale();
        let url = _url;
        if (locale === 'en') {
            url = domain + `${locale}-US/` + path;
        } else if (locale === 'fr') {
            url = domain + `${locale}/` + path;
        }
        const html = await axios.get(url).then((res) => res.data);
        if (!html) return;
        const $ = cheerio.load(html);
        const reg = /`?<a\shref=\"([^"]*)">([^<]*)<\/a>`?/im;
        let description = $('p')
            .first()
            .html()
            ?.replace(/<[^>]*code>/g, '`')
            .replace(/<[^>]*strong>/g, '**')
            .replace(/&nbsp;/g, ' ')
            .replace(/<[^>]*em>/g, '_');
        const title = $('h1').first().text();
        const element = cheerio.load(description as string);
        let contentLinks: string[] = [];
        let _links: string[] = [];
        element('a').each(function () {
            const text = element(this).text();
            const l = element(this).attr('href') ?? '';
            contentLinks.push(text);
            _links.push(l);
        });
        let links = _links.map((li) => domain.slice(0, -1) + li);
        links = links.map((li, i) => `[${contentLinks[i]}](${li})`);
        links.forEach((link) => {
            description = description?.replace(reg, link);
        });
        if (!description) description = foo.__compat?.description;
        const yes = message.guild?.i18n.__mf('common.yes'),
            no = message.guild?.i18n.__mf('common.no');
        const embed = new MessageEmbed()
            .setTitle(message.guild!.i18n.__mf('mdn.doc', { val: title }))
            .setDescription(description)
            .setURL(url)
            .setImage(
                'https://developer.mozilla.org/mdn-social-share.0ca9dbda.png'
            )
            .addField(
                message.guild!.i18n.__mf('mdn.experimental'),
                foo.__compat?.status?.experimental
                    ? message.guild?.i18n.__mf('mdn.experimental_desc', {
                          value: yes,
                      })
                    : message.guild!.i18n.__mf('mdn.experimental_desc', {
                          value: no,
                      })
            )
            .addField(
                message.guild!.i18n.__mf('mdn.deprecated'),
                foo.__compat?.status?.deprecated
                    ? message.guild!.i18n.__mf('mdn.deprecated_desc', {
                          value: yes,
                      })
                    : message.guild!.i18n.__mf('mdn.deprecated_desc', {
                          value: no,
                      })
            );
        message.channel.send(embed);
    }
}
