import Interaction from '../Interactions/Interaction';
import CommandInteraction from '../Interactions/CommandInteraction';
import { SubOptions, Options } from './Interaction';

/**
 * Options of the {@link CommandInteraction.send send} method in CommandInteraction
 */
export interface SendOptions {
    /**
     * If the interaction should be ephemeral
     */
    ephemeral?: boolean;
    /**
     * Add a response to the message when it's an object
     */
    response?: string | undefined;
}

/**
 * Options for deferring the reply to an {@link Interaction}.
 */
export interface InteractionDeferOptions {
    /**
     * Whether the reply should be ephemeral
     */
    ephemeral?: boolean;
    /**
     * Whether to fetch the reply
     */
    fetchReply?: boolean;
}

/**
 * The edit options of {@link CommandInteraction.edit edit()}
 */
export interface EditOptions {
    /**
     * The response if there's embeds or attachments, similar to {@link SendOptions.response}
     */
    response?: string;
}

export interface CommandInteractionType {
    application_id: string;
    channel_id: string;
    data: Data;
    guild_id: string;
    id: string;
    member: Member;
    token: string;
    type: number;
    version: number;
}

export interface Data {
    type: number;
    name: string;
    id: string;
    options: Options[];
    resolved: any;
}

export interface Member {
    avatar: null;
    deaf: boolean;
    is_pending: boolean;
    joined_at: string;
    mute: boolean;
    nick: null;
    pending: boolean;
    permissions: string;
    premium_since: null;
    roles: string[];
    user: User;
}

export interface User {
    avatar: string;
    discriminator: string;
    id: string;
    public_flags: number;
    username: string;
}
