import { User, GuildMember, Snowflake, Channel, Role } from 'discord.js';
import CommandInteraction from '../Interactions/CommandInteraction';
import CommandInteractionOptionResolver from '../Interactions/CommandInteractionOptionResolver';
/**
 * The sub-options of the options
 */
export interface SubOptions {
    /**
     * The name of the option
     */
    name: string;
    /**
     * The type of the option, `string` is caused by {@link CommandInteraction.transformOption}
     */
    type: number | string;
    /**
     * The value of the option
     */
    value: string;
}

/**
 * The options of an {@link CommandInteraction}
 */
export interface Options {
    /**
     * The name of the option
     */
    name: string;
    /**
     * The type of the option
     */
    type: number;
    /**
     * If there's reccursive options
     */
    options?: SubOptions[] | Options[];
    /**
     * The value of the option
     */
    value?: string;
}

export interface Data {
    name: string;
    id: Snowflake;
    content?: string;
    options?: Options[];
    resolved?: ResolvedData;
}
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
}
export interface InteractionUser {
    avatar: string;
    discriminator: string;
    id: Snowflake;
    public_flags: number;
    username: string;
}
export interface Interaction {
    member?: Member;
    user?: InteractionUser;
    guild_id?: Snowflake;
    data: Data;
    token: string;
    type: number;
    version: number;
    application_id: Snowflake;
    channel_id: Snowflake;
    id: Snowflake;
}
/**
 * The data resolved
 */
export interface ResolvedData {
    /**
     * The user
     */
    user?: User;
    /**
     * The guild member
     */
    member?: GuildMember;
}
