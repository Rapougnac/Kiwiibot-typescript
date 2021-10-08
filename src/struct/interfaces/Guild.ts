import { APIMessageContentResolvable, MessageAdditions, MessageOptions, SplitOptions, StringResolvable, AllowedImageFormat, ImageSize, ImageURLOptions } from 'discord.js';
import { I18n } from 'i18n';

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
    avatar: string | null;
    avatarURL(
        options?: ImageURLOptions & { dynamic?: boolean }
    ): string | null;
    displayAvatarURL(
        options?: ImageURLOptions & { dynamic?: boolean }
    ): string;
    GuildMemberAvatar(
        guildId: string,
        memberId: string,
        hash: string | null,
        format?: AllowedImageFormat,
        size?: ImageSize,
        dynamic?: boolean
    ): string | null;
}