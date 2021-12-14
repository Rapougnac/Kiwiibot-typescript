import type { PermissionString, Message, Guild } from 'discord.js';
import type Client from './Client';
import Loader from './LoadingBar';
import type { TimeData } from './interfaces/main';
import type Command from './Command';
import NekoClient from 'nekos.life';
import AmeClient from 'amethyste-api';
import { officialApi } from 'mal-scraper';
import akaneko from 'akaneko';
export default class Util {
    /**
     * The client passed in
     */
    public readonly client: Client;
    /**
     * The loader class
     */
    public loader: Loader;
    /**
     * The neko client
     */
    public readonly neko: NekoClient;
    /**
     * The améthyste client
     */
    public readonly AmeAPI: AmeClient;

    /**
     * The MyAnimeList API
     */
    public readonly MALApi: officialApi;

    /**
     * The akaneko api
     */
    public akaneko: typeof akaneko;
    /**
     * This is a class where the client can acces easily
     * @param client The client that instancied this manager
     */
    constructor(client: Client) {
        this.client = client;
        this.loader = new Loader();
        this.neko = new NekoClient();
        this.AmeAPI = new AmeClient(this.client.config.amethyste.client);
        this.MALApi = new officialApi(this.client.config.MAL);
        this.akaneko = akaneko;
    }

    formatPerms(perms: PermissionString) {
        return perms
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use Voice Activity');
    }
    /**
     * Parses ms time
     * @param milliseconds Time to parse
     */
    parseMs(milliseconds: number): TimeData {
        const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

        return {
            days: roundTowardsZero(milliseconds / 86400000),
            hours: roundTowardsZero(milliseconds / 3600000) % 24,
            minutes: roundTowardsZero(milliseconds / 60000) % 60,
            seconds: roundTowardsZero(milliseconds / 1000) % 60,
        };
    }
    /**
     * Format time
     * @param time Time
     */
    format(time: number): string {
        const hrs = ~~(time / 3600);
        const mins = ~~((time % 3600) / 60);
        const secs = ~~time % 60;

        let ret = '';
        if (hrs > 0) {
            ret += `${hrs}:${mins < 10 ? '0' : ''}`;
        }
        ret += `${mins}:${secs < 10 ? '0' : ''}`;
        ret += `${secs}`;
        return `\`${ret}\``;
    }
    /**
     * Check if the passed input is a class or not.
     * @param input The input to check
     */
    isClass(input: unknown): boolean {
        return (
            typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class'
        );
    }
    /**
     * Remove duplicated values in an array.
     * @param array The array to pass in.
     */
    removeDuplicates(array: unknown[]): unknown[] {
        return [...new Set(array)];
    }

    checkPermissions(message: Message, command: Command) {
        const reasons = [];
        if (message.channel.type === 'DM') {
            if (command.config.guildOnly) {
                reasons.push(
                    (message.guild as unknown as Guild).i18n.__mf(
                        'PERMS_MESSAGE.guild_only'
                    )
                );
            }
        }

        if (command.config.ownerOnly) {
            if (!this.client.isOwner(message.author)) {
                reasons.push(
                    message.guild?.i18n.__mf('PERMS_MESSAGE.dev_only')
                );
            }
        }
        if (command.config.adminOnly) {
            if (!message.member?.permissions.has('ADMINISTRATOR')) {
                reasons.push(
                    message.guild?.i18n.__mf('PERMS_MESSAGE.admin_only')
                );
            }
        }
        if (command.config.nsfw) {
            if (
                message.channel.type === 'GUILD_TEXT' &&
                !message.channel.nsfw
            ) {
                reasons.push(message.guild?.i18n.__mf('PERMS_MESSAGE.nsfw'));
            }
        }
        if (Array.isArray(command.config.permissions)) {
            if (
                message.channel.type === 'GUILD_TEXT' &&
                message.member &&
                !message.channel
                    .permissionsFor(message.member)
                    .has(command.config.permissions)
            ) {
                reasons.push(
                    [
                        message.guild?.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_you'
                        ),
                        message.guild?.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions1_you'
                        ),
                        Object.entries(
                            message.channel
                                .permissionsFor(message.member)
                                .serialize()
                        )
                            .filter(
                                (p) =>
                                    command.config.permissions.includes(
                                        p[0] as PermissionString
                                    ) && !p[1]
                            )
                            .flatMap((c) =>
                                c[0]
                                    .toLowerCase()
                                    .replace(/(^|"|_)(\S)/g, (x) =>
                                        x.toUpperCase()
                                    )
                                    .replace(/_/g, ' ')
                                    .replace(/Guild/g, 'Server')
                                    .replace(/Use Vad/g, 'Use Voice Activity')
                            )
                            .join('\n\u2000\u2000- '),
                    ].join('')
                );
            }
        }
        if (Array.isArray(command.config.clientPermissions)) {
            if (
                message.channel.type === 'GUILD_TEXT' &&
                message.guild &&
                message.guild.me &&
                !message.channel
                    .permissionsFor(message.guild.me)
                    .has(command.config.clientPermissions)
            ) {
                reasons.push(
                    [
                        message.guild.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_i'
                        ),
                        message.guild.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions1_i'
                        ),
                        Object.entries(
                            message.channel
                                .permissionsFor(message.guild.me)
                                .serialize()
                        )
                            .filter(
                                (p) =>
                                    command.config.clientPermissions.includes(
                                        p[0] as PermissionString
                                    ) && !p[1]
                            )
                            .flatMap((c) =>
                                c[0]
                                    .toLowerCase()
                                    .replace(/(^|"|_)(\S)/g, (x) =>
                                        x.toUpperCase()
                                    )
                                    .replace(/_/g, ' ')
                                    .replace(/Guild/g, 'Server')
                                    .replace(/Use VAD/g, 'Use Voice Activity')
                            )
                            .join('\n\u2000\u2000- '),
                    ].join('')
                );
            }
        }
        return reasons;
    }
}
