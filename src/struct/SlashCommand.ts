import { Message } from 'discord.js';
import Client from './Client';
import { SlashCommandOptions, CommandOptions } from './interfaces/SlashCommand';

export default abstract class SlashCommand {
    /**
     * The client from the slash command
     */
    public readonly client: Client;
    /**
     * The name of the command
     */
    public name: string;
    /**
     * The description of the command
     */
    public description: string;
    /**
     * If the command should be global
     */
    public global: boolean;
    /**
     * The command options
     */
    public commandOptions: CommandOptions[];
    constructor(client: Client, options: SlashCommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.global = options.global || false;
        this.commandOptions =
            options.commandOptions as unknown as CommandOptions[];
    }

    public execute(
        ..._args: never
    ): Promise<void | Message | string> | void | Message | string {
        throw new Error(`${this.name} dosen't have an execute() method!`);
    }

    public toJSON(): {
        name: string;
        description: string;
        options: CommandOptions[];
    } {
        return {
            name: this.name,
            description: this.description,
            options: this.commandOptions,
        };
    }
}
