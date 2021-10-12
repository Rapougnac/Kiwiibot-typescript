import { Structures, Guild, Client } from 'discord.js';
import i18n, { I18n } from 'i18n';
import KiwiiClient from './Client';
import * as path from 'path';

class ExtendedGuild extends Guild {
    public readonly i18n: I18n;
    public prefix: string;
    constructor(client: KiwiiClient, data: any) {
        super(client as unknown as Client, data);

        i18n.configure({
            locales: ['en', 'fr'],
            directory: path.join(process.cwd(), 'locales'),
            objectNotation: true,
        });
        this.i18n = i18n;
        this.i18n.setLocale('en');
        this.prefix = client.prefix;
    }
}

Structures.extend('Guild', () => ExtendedGuild as any);