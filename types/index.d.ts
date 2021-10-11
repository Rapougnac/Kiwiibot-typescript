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
        i18n: I18n;
        prefix: string;
    }
    export interface User {
        banner: string | null;
        Banner(
            userID: string,
            hash: string,
            format?: AllowedImageFormat,
            size?: ImageSize,
            dynamic?: boolean
        ): string;
        displayBannerURL(
            ImageURLOptions: ImageURLOptions & { dynamic?: boolean }
        ): string | null;
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
