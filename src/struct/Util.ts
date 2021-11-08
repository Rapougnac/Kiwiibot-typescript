import {
    PermissionString,
    AllowedImageFormat,
    AllowedImageSize,
    Message,
    MessageTarget,
    MessageOptions,
    WebhookMessageOptions,
    GuildMember,
    Permissions,
    Guild,
} from 'discord.js';
import Client from './Client';
import Loader from './LoadingBar';
import { TimeData } from './interfaces/main';
import Command from './Command';
import KiwiiClient from './Client';
import NekoClient from 'nekos.life';
import AmeClient from 'amethyste-api';
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
     * This is a class where the client can acces easily
     * @param client The client that instancied this manager
     */
    constructor(client: Client) {
        this.client = client;
        this.loader = new Loader();
        this.neko = new NekoClient();
        this.AmeAPI = new AmeClient(this.client.config.amethyste.client);
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
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        var ret = '';
        if (hrs > 0) {
            ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
        }
        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
        ret += '' + secs;
        return `\`${ret}\``;
    }

    makeImageUrl(
        root: string,
        {
            format = 'webp',
            size,
        }: { format?: AllowedImageFormat; size?: AllowedImageSize } = {}
    ): string {
        const AllowedImageFormats = ['webp', 'png', 'jpg', 'jpeg', 'gif'];
        const AllowedImageSizes = Array.from(
            { length: 9 },
            (e, i) => 2 ** (i + 4)
        );
        if (format && !AllowedImageFormats.includes(format))
            throw new Error('IMAGE_FORMAT' + format);
        if (size && !AllowedImageSizes.includes(size))
            throw new RangeError('IMAGE_SIZE' + size);
        return `${root}.${format}${size ? `?size=${size}` : ''}`;
    }
    /**
     * Check if the passed input is a class or not.
     * @param input The input to check
     */
    isClass(input: any): boolean {
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
    removeDuplicates(array: any[]): any[] {
        return [...new Set(array)];
    }

    checkPermissions(message: Message, command: Command) {
        const reasons = [];
        if (message.channel.type === 'GUILD_TEXT') {
            if (command.config.guildOnly) {
                reasons.push(
                    (message.guild as unknown as Guild).i18n.__mf(
                        'PERMS_MESSAGE.guild_only'
                    )
                );
            }
        }

        if (command.config.ownerOnly) {
            if (
                !(message.client as unknown as KiwiiClient).isOwner(
                    message.author
                )
            ) {
                reasons.push(
                    (message.guild as unknown as Guild).i18n.__mf(
                        'PERMS_MESSAGE.dev_only'
                    )
                );
            }
        }
        if (command.config.adminOnly) {
            if (!message.member!.permissions.has('ADMINISTRATOR')) {
                reasons.push(
                    (message.guild as unknown as Guild).i18n.__mf(
                        'PERMS_MESSAGE.admin_only'
                    )
                );
            }
        }
        if (command.config.nsfw) {
            if (
                message.channel.type === 'GUILD_TEXT' &&
                !message.channel.nsfw
            ) {
                reasons.push(
                    (message.guild as unknown as Guild).i18n.__mf(
                        'PERMS_MESSAGE.nsfw'
                    )
                );
            }
        }
        if (Array.isArray(command.config.permissions)) {
            if (
                message.channel.type === 'GUILD_TEXT' &&
                !(
                    message.channel.permissionsFor(
                        message.member as GuildMember
                    ) as Readonly<Permissions>
                ).has(command.config.permissions)
            ) {
                reasons.push(
                    [
                        (message.guild as unknown as Guild).i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_you'
                        ),
                        (message.guild as unknown as Guild).i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions1_you'
                        ),
                        Object.entries(
                            (
                                message.channel.permissionsFor(
                                    message.member as GuildMember
                                ) as Readonly<Permissions>
                            ).serialize()
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
                !(
                    message.channel.permissionsFor(
                        message.guild!.me as GuildMember
                    ) as Readonly<Permissions>
                ).has(command.config.clientPermissions)
            ) {
                reasons.push(
                    [
                        (message.guild as unknown as Guild).i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_i'
                        ),
                        (message.guild as unknown as Guild).i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions1_i'
                        ),
                        Object.entries(
                            (
                                message.channel.permissionsFor(
                                    message.guild!.me as GuildMember
                                ) as Readonly<Permissions>
                            ).serialize()
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
