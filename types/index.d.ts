import { APIMessageContentResolvable, Message } from 'discord.js';
import { I18n } from 'i18n';

declare namespace Intl {
    class ListFormat {
        public format: (items: [string?]) => string;
    }
}

declare module 'discord.js' {
    export interface MessageMentionOptions {
        repliedUser?: boolean;
    }

    export interface Message {
        inlineReply(
            content:
                | APIMessageContentResolvable
                | (MessageOptions & { split?: boolean })
                | MessageAdditions
        ): Promise<Message>;
        inlineReply(
            options: MessageOptions & { split: true | SplitOptions }
        ): Promise<Message[]>;
        inlineReply(options: MessageOptions): Promise<Message | Message[]>;
        inlineReply(
            content: StringResolvable,
            options: (MessageOptions & { split?: false }) | MessageAdditions
        ): Promise<Message>;
        inlineReply(
            content: StringResolvable,
            options: MessageOptions & { split: true | SplitOptions }
        ): Promise<Message[]>;
        inlineReply(
            content: StringResolvable,
            options: MessageOptions
        ): Promise<Message | Message[]>;
    }
    export interface Guild {
        /**
         * The i18n obect notation
         */
        i18n: I18n;
        /**
         * The prefix of the guild, if there's one.
         */
        prefix: string;
    }
    export interface User {
        /**
         * The hash of the user's banner
         */
        banner: string | null;
        /**
         * Get the banner of the user
         * @param userID The user id to pass in.
         * @param hash The hash of the banner
         * @param format The format of the image
         * @param size The size of the banner
         * @param dynamic If avaliable and if true, the format will be .gif
         * @param root The root url
         * @returns The url of the banner
         */
        Banner(
            userID: string,
            hash: string,
            format?: AllowedImageFormat,
            size?: ImageSize,
            dynamic?: boolean
        ): string;
        /**
         * Display the banner url of the user, if there's one
         * @returns The url of the banner
         */
        displayBannerURL(
            ImageURLOptions: ImageURLOptions & { dynamic?: boolean }
        ): string | null;
        /**
         * Check if the user has a banner
         */
        hasBanner(): boolean;
    }

    interface GuildMember {
        /**
         * The hash of the guild member's avatar
         */
        avatar: string | null;
        /**
         * A link to the member's guild avatar.
         * @param options Options for the image url
         * @returns {?string}
         */
        avatarURL(
            options?: ImageURLOptions & { dynamic?: boolean }
        ): string | null;
        /**
         * A link to the guild member's avatar
         * if none found, return the user's avatar
         * @param options The options of the avatar
         */
        displayAvatarURL(
            options?: ImageURLOptions & { dynamic?: boolean }
        ): string;
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
            guildId: string,
            memberId: string,
            hash: string | null,
            format?: AllowedImageFormat,
            size?: ImageSize,
            dynamic?: boolean
        ): string | null;
    }
}

declare module 'mongoose' {
    interface Connection {
        /**
         * Send `true` if the connection is etablished successfully 
         */
        _hasOpened: boolean;
    }
}

declare module '*.png'