import { User } from 'discord.js';

/**
 * The raw member object when discord is responding
 */
export interface Member {
    /**
     * The hash of the guild member's avatar, it may be confusing with {@link User.avatar}
     */
    avatar: string | null;
    /**
     * If the guild member is deafed
     */
    deaf: boolean;
    /**
     * If the guild member is pending
     */
    is_pending: boolean;
    /**
     * The date when the guild member joined the guild
     */
    joined_at: boolean;
    /**
     * If the guild member is muted
     */
    mute: boolean;
    /**
     * The nickname of the guild member, if there are one
     */
    nick: string | null;
    /**
     * The permissions of the guild member
     */
    permissions: string;
    /**
     * The date when the guild member has been premium
     */
    premium_since: string;
    /**
     * The roles of the user
     */
    roles: string[];
    /**
     * The user object
     */
    user: User;
}
