import KiwiiClient from '../Client';
import SlashCommand from '../SlashCommand';

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
    commandOptions?: CommandOptions[];
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
    type: number;
    /**
     * If the option is required
     */
    required?: boolean;
    /**
     * The choices to add, if provided
     */
    choices?: [
        {
            /**
             * The name of the choice
             */
            name: string;
            /**
             * The value of the choice
             */
            value: string;
        }
    ];
    /**
     * The command options
     */
    options?: CommandOptions[];
}

/**
 * The constructor of the slash command
 */
export interface SlashCommandConstructor {
    new (client: KiwiiClient, options?: CommandOptions): SlashCommand;
    readonly prototype: SlashCommand;
}
