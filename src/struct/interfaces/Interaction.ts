import { User, GuildMember } from 'discord.js';  

export interface SubOptions {
    name: string;
    type: number;
    value: string;
};

export interface Options {
    name: string;
    type: number;
    options: SubOptions[];
};

export interface Data {
    name: string;
    id: string;
    content?: string;
    options?: Options[];
    resolved?: {
        user: User;
        member: GuildMember;
    };
};
export interface Member {
    avatar?: string;
    deaf: boolean;
    is_pending: boolean;
    joined_at: boolean;
    mute: boolean;
    nick?: string;
    permissions: string;
    premium_since: string;
    roles: Array<string>;
    user: User;
};
export interface InteractionUser {
    avatar: string;
    discriminator: string;
    id: string;
    public_flags: number;
    username: string;
};
export interface Interaction {
    member?: Member;
    user?: InteractionUser;
    guild_id?: string;
    data: Data;
    token: string;
    type: number;
    version: number;
    application_id: string;
    channel_id: string;
    id: string;
};
