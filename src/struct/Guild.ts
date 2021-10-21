import { Structures, Guild, Client } from 'discord.js';
import { I18n } from 'i18n';
import KiwiiClient from './Client';
import * as path from 'path';

class ExtendedGuild extends Guild {
    public readonly i18n: I18n;
    public prefix: string;
    constructor(client: KiwiiClient, data: any) {
        super(client as unknown as Client, data);
        this.i18n = new I18n();
        this.i18n.configure({
            locales: ['en', 'fr'],
            directory: path.join(process.cwd(), 'locales'),
            objectNotation: true,
        });
        this.i18n.setLocale('en');
        this.prefix = client.prefix;
    }
}

Structures.extend('Guild', () => ExtendedGuild as any);
