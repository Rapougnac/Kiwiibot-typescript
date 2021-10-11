import {
    GuildMember,
    Structures,
    Guild,
    Client,
    Snowflake,
    AllowedImageFormat,
    ImageSize,
    ImageURLOptions,
} from 'discord.js';
import KiwiiClient from './Client';
import { RawMember } from './interfaces/main';

class ExtendedGuildMember extends GuildMember {
    /**
     * The hash of the guild member's avatar
     */
    public avatar: string | null;
    constructor(client: KiwiiClient, data: object, guild: Guild) {
        super(client as unknown as Client, data, guild);
        this.avatar = null;
        (this.client as any).api
            .guilds(this.guild.id)
            .members((data as any).id)
            .get()
            .then((_data: RawMember) => {
                if ('avatar' in _data) {
                    this.avatar = _data.avatar;
                } else if (typeof this.avatar !== 'string') {
                    this.avatar = null;
                }
            });
    }
    /**
     * Construct a guild member avatar from the given informations
     * @param guildId The guild id
     * @param memberId The member id
     * @param hash The hash of the guild member's avatar
     * @param format The format of the guild member's avatar
     * @param size The size of the guild member's avatar
     * @param dynamic If the image should be dynamic
     */
    GuildMemberAvatar(
        guildId: Snowflake,
        memberId: Snowflake,
        hash: string | null,
        format: AllowedImageFormat = 'webp',
        size: ImageSize,
        dynamic: boolean = false
    ) {
        const root = 'https://cdn.discordapp.com';
        if (dynamic) format = hash?.startsWith('a_') ? 'gif' : format;
        return (this.client as unknown as KiwiiClient).utils.makeImageUrl(
            `${root}/guilds/${guildId}/users/${memberId}/avatars/${hash}`,
            { format, size }
        );
    }
    /**
     * A link to the member's guild avatar.
     * @param options Options for the image url
     * @returns {?string}
     */
    avatarURL({
        format,
        size,
        dynamic,
    }: ImageURLOptions & { dynamic?: boolean } = {}): string | null {
        if (!this.avatar) return null;
        return this.GuildMemberAvatar(
            this.guild.id,
            this.id,
            this.avatar,
            format,
            size as ImageSize,
            dynamic
        );
    }
    /**
     * A link to the guild member's avatar
     * if none found, return the user's avatar
     * @param options The options of the avatar
     */
    displayAvatarURL(
        options?: ImageURLOptions & { dynamic?: boolean }
    ): string {
        return this.avatarURL(options) || this.user.displayAvatarURL(options);
    }
}


Structures.extend('GuildMember', () => ExtendedGuildMember as any);