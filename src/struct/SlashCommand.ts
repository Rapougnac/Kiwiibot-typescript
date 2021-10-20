import { Message } from 'discord.js';
import Client from './Client';
import { SlashCommandOptions, CommandOptions } from './interfaces/SlashCommand';

export default class SlashCommand {
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

    public execute(...args: any): Promise<void | Message> | void | Message {
        throw new Error(`${this.name} dosen't have an execute() method!`);
    }
}
