import type KiwiiClient from '../Client';
import type SlashCommand from '../SlashCommand';
import type {
  ApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationCommandOptionData,
} from 'discord.js';

export interface SlashCommandOptions {
  /**
   * The name of the command
   */
  name: string;
  /**
   * The description of the command
   */
  description: string;
  /**
   * If the command should be global
   */
  global?: boolean;
  /**
   * Command options
   */
  commandOptions?: ApplicationCommandOptionData[];

  /**
   * The type of the command, defaults `1` if not set
   *
   * `1` = CHAT_INPUT (default) - Slash commands; a text-based command that shows up when a user types / in chat.
   *
   * `2` = USER A UI-based command that shows up when you right click or tap on a user.
   *
   * `3` = MESSAGE A UI-based command that shows up when you right click or tap on a message.
   */
  type?: ApplicationCommandType;

  /**
   * If the command is enabled by default when the app is added to guild
   */
  defaultPermission?: boolean;
}

export interface CommandOptions {
  /**
   * The name of the command
   */
  name: string;

  /**
   * The description of the command
   */
  description: string;

  /**
   * One of `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` and `9`
   *
   * `1` = SUB_COMMAND
   *
   * `2` = SUB_COMMAND_GROUP
   *
   * `3` = STRING
   *
   * `4` = INTEGER
   *
   * `5` = BOOLEAN
   *
   * `6` = USER
   *
   * `7` = CHANNEL
   *
   * `8` = ROLE
   *
   * `9` = MENTIONABLE
   */
  type: ApplicationCommandOptionType;
  /**
   * If the option is required
   */
  required?: boolean;
  /**
   * The choices to add, if provided
   */
  choices?: ApplicationCommandOptionChoice[];
  /**
   * The command options
   */
  options?: CommandOptions[];

  /**
   * If the command should be auto-completed
   */
  autocomplete?: boolean;
}

/**
 * `1` = CHAT_INPUT (default) - Slash commands; a text-based command that shows up when a user types / in chat.
 *
 * `2` = USER A UI-based command that shows up when you right click or tap on a user.
 *
 * `3` = MESSAGE A UI-based command that shows up when you right click or tap on a message.
 */
export type AllowedTypes = 1 | 2 | 3;

/**
 * `0` = GUILD_TEXT - A text channel within a server.
 *
 * `1` = DM - A direct message between two users.
 *
 * `2` = GUILD_VOICE - A voice channel within a server.
 *
 * `3` = GROUP_DM - A direct message between two users.
 *
 * `4` = GUILD_CATEGORY - A category within a server.
 *
 * `5` = GUILD_NEWS - A news channel within a server.
 *
 * `6` = GUILD_STORE - A store channel within a server.
 *
 * `10` = GUILD_NEWS_THREAD - A temporary sub-channel within a GUILD_NEWS channel.
 *
 * `11` = GUILD_PUBLIC_THREAD - A temporary sub-channel within a GUILD_TEXT channel.
 *
 * `12` = GUILD_PRIVATE_THREAD - A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission.
 *
 * `13` = GUILD_STAGE_VOICE - A voice channel for hosting events with an audience
 */
// export type ChannelTypes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10 | 11 | 12 | 13;

/**
 * The constructor of the slash command
 */
export interface SlashCommandConstructor {
  // eslint-disable-next-line no-unused-vars
  new (client: KiwiiClient, options?: CommandOptions): SlashCommand;
  readonly prototype: SlashCommand;
}
