import {
    APIMessage,
    MessageEmbed,
    PermissionString,
    AllowedImageFormat,
    ImageSize,
    Message,
    MessageTarget,
    APIMessageContentResolvable,
    MessageOptions,
    MessageAdditions,
    WebhookMessageOptions,
    TextChannel,
    GuildMember,
    Permissions,
} from 'discord.js';
import Client from './Client';
import Loader from './LoadingBar';
import { TimeData, Interaction, Guild } from './interfaces/main';
import Command from './Command';
import KiwiiClient from './Client';
export default class Util {
    /**
     * The client passed in
     */
    public readonly client: Client;
    /**
     * The loader class
     */
    public loader: Loader;
    constructor(client: Client) {
        this.client = client;
        this.loader = new Loader();
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

    async createAPIMessage(
        interaction: Interaction,
        content: MessageOptions | MessageAdditions | WebhookMessageOptions,
        str?: string
    ) {
        const { data, files } = await APIMessage.create(
            this.client.channels.resolve(
                interaction.channel_id
            ) as MessageTarget,
            str as APIMessageContentResolvable,
            content
        )
            .resolveData()
            .resolveFiles();

        return { ...data, files };
    }
    /**
     * Reply to the interaction, but with ephemeral message
     * @param interaction
     * @param content
     */
    async replyEphemeral(interaction: any, content: string): Promise<void> {
        let data: object | any = {
            flags: 1 << 6,
            content: content,
        };
        if (typeof content === 'object')
            data = await this.createAPIMessage(interaction, content);
        (this.client as any).api
            .interactions(interaction.id, interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    flags: 1 << 6,
                    data,
                },
            });
    }
    /**
     *
     * @param interaction
     * @param response
     * @param content
     */
    async reply(
        interaction: any,
        response: MessageOptions | MessageAdditions | WebhookMessageOptions,
        content: string
    ): Promise<void> {
        let data: {
            content?: MessageOptions | MessageAdditions | WebhookMessageOptions;
        } = {
            content: response,
        };

        if (typeof response === 'object') {
            data = (await this.createAPIMessage(
                interaction,
                response,
                content
            )) as any;
        }
        await (this.client as any).api
            .interactions(interaction.id, interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    data,
                },
            });
    }
    /**
     * Delete a slash command
     * @param id The command id to put on.
     */
    deleteSlash(id: string) {
        (this.client as any).api
            .applications(this.client.user!.id)
            .commands(id)
            .delete()
            .then(() => console.log('Command has been successfully deleted!'));
    }

    makeImageUrl(
        root: string,
        {
            format = 'webp',
            size,
        }: { format?: AllowedImageFormat; size?: ImageSize } = {}
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
        if (message.channel.type === 'dm') {
            if (command.config.guildOnly) {
                reasons.push(
                    message.guild!.i18n.__mf('PERMS_MESSAGE.guild_only')
                );
            }
        }

        if (command.config.ownerOnly) {
            if (!(message.client as unknown as KiwiiClient).isOwner(message.author)) {
                reasons.push(
                    message.guild!.i18n.__mf('PERMS_MESSAGE.dev_only')
                );
            }
        }
        if (command.config.adminOnly) {
            if (!message.member!.hasPermission('ADMINISTRATOR')) {
                reasons.push(
                    message.guild!.i18n.__mf('PERMS_MESSAGE.admin_only')
                );
            }
        }
        if (command.config.nsfw) {
            if (message.channel.type === 'text' && !message.channel.nsfw) {
                reasons.push(message.guild!.i18n.__mf('PERMS_MESSAGE.nsfw'));
            }
        }
        if (Array.isArray(command.config.permissions)) {
            if (
                message.channel.type === 'text' &&
                !(
                    message.channel.permissionsFor(
                        message.member as GuildMember
                    ) as Readonly<Permissions>
                ).has(command.config.permissions)
            ) {
                reasons.push(
                    [
                        message.guild!.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_you'
                        ),
                        message.guild!.i18n.__mf(
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
                message.channel.type === 'text' &&
                !(
                    message.channel.permissionsFor(
                        message.guild!.me as GuildMember
                    ) as Readonly<Permissions>
                ).has(command.config.clientPermissions)
            ) {
                reasons.push(
                    [
                        message.guild!.i18n.__mf(
                            'PERMS_MESSAGE.missing_permissions_i'
                        ),
                        message.guild!.i18n.__mf(
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
