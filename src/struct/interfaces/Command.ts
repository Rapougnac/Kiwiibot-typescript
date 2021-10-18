import { PermissionString } from 'discord.js';
import KiwiiClient from '../Client';
import Command from '../Command';
export interface CommandOptions {
    /**
     * The name of the command
     */
    readonly name: string;

    /**
     * The description of the command
     */
    description?: string;

    /**
     * The usage of the command
     */
    utilisation?: string;

    /**
     * The category of the command
     */
    category?: string;

    /**
     * The user's permissions, if no permissions was provided, `['SEND_MESSAGES', 'VIEW_CHANNEL']` are the default one.
     */
    permissions?: PermissionString[];

    /**
     * The client's permissions, if no permissions was provided, `['SEND_MESSAGES', 'VIEW_CHANNEL']` are the default one.
     */
    clientPermissions?: PermissionString[];

    /**
     * The cooldown of the command, none if the cooldown was not specified
     */
    cooldown?: number;

    /**
     * The aliases of the command, none if aliases was not provided.
     */
    readonly aliases?: string[];

    /**
     * If the command can only be used in guilds, `false` by default.
     */
    guildOnly?: boolean;

    /**
     * If the command can only be executed by users that have the administrator permission, `false`by default.
     */
    adminOnly?: boolean;

    /**
     * If the command can only be executed by the owner of the bot, `false` by default.
     */
    ownerOnly?: boolean;

    /**
     * If the command is nsfw or not, `false` by default
     */
    nsfw?: boolean;

    /**
     * Whether the command should be hidden from the help menu
     */
    hidden?: boolean;
}

export interface HelpOptions {
    /**
     * The name of the command
     */
    readonly name: string;

    /**
     * The description of the command
     */
    description: string | undefined;

    /**
     * The usage of the command
     */
    utilisation: string | undefined;

    /**
     * The category of the command
     */
    category: string | undefined;
}

export interface ConfigOptions {
    /**
     * The user's permissions, if no permission was provided
     * ```ts
     * ['SEND_MESSAGES', 'VIEW_CHANNEL']
     * ```
     * are the default ones
     */
    permissions: PermissionString[];

    /**
     * The client's permissions, if no permission was provided
     * ```ts
     * ['SEND_MESSAGES', 'VIEW_CHANNEL']
     * ```
     * are the default one.
     */
    clientPermissions: PermissionString[];

    /**
     * The cooldown of the command, none if the cooldown was not specified
     */
    cooldown: number;

    /**
     * The aliases of the command, none if aliases was not specified
     */
    aliases: string[];

    /**
     * If the command can only be used inside guilds or not, `false` by default
     */
    guildOnly: boolean;

    /**
     * If the command can only be used by users who have the administrator permission, `false` by default
     */
    adminOnly: boolean;

    /**
     * If the command can only be executed by the owner of the bot, `false` by default
     */
    ownerOnly: boolean;

    /**
     * If the command is nsfw or not, `false`, by default
     */
    nsfw: boolean;

    /**
     * If the command should be hidden from the help menu
     */
    hidden: boolean;
}

export interface TraceOptions {
    /**
     * The path of the command, by default the value returned is the path of the current executed command.
     */
    command?: string;
    /**
     * If the value should return the directory name instead of file name
     * @example
     * <Command>.trace(); // Output: path/to/command/test.js
     * <Command>.trace({ dir: true }); // Output: path/to/command
     */
    dir?: boolean;
}

export interface ConstructorCommand {
    new (client: KiwiiClient, options?: CommandOptions): Command;
}