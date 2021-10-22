import { Collection, Message, PresenceManager } from 'discord.js';
import Client from './Client';
import {
    CommandOptions,
    HelpOptions,
    ConfigOptions,
    TraceOptions,
} from './interfaces/Command';
import glob from 'glob';
import * as path from 'path';

export default class Command {
    /**
     * The client used in the command
     */
    public readonly client: Client;
    /**
     * The help interface of the command
     */
    public help: HelpOptions;
    /**
     * The config interface of the command
     */
    public config: ConfigOptions;
    /**
     * A collection of the ids of the users on cooldown
     */
    public cooldown: Collection<string, number>;
    /**
     * The message object
     */
    public message: Message | null;
    constructor(client: Client, options: CommandOptions) {
        this.client = client;
        this.help = {
            name: options.name,
            description: options.description,
            utilisation: options.utilisation,
            category: options.category,
            img: options.img,
        };
        this.config = {
            permissions: options.permissions || [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
            ],
            clientPermissions: options.clientPermissions || [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
            ],
            cooldown: Number(options.cooldown) * 1000 || -1,
            aliases: options.aliases || [],
            guildOnly: options.guildOnly || false,
            adminOnly: options.adminOnly || false,
            ownerOnly: options.ownerOnly || false,
            nsfw: options.nsfw || false,
            hidden: options.hidden || false,
        };
        this.cooldown = new Collection();
        this.message = null;
    }
    /**
     * Trace the command
     */
    private trace({
        command = this.help.name,
        dir = false,
    }: TraceOptions = {}): string | undefined {
        let files = glob.sync('./dist/src/commands/**/*.js');
        let Path: string | undefined;
        const exclude = this.client.config.discord.dev.exclude_cmd;
        const include = this.client.config.discord.dev.include_cmd;
        if (this.client.config.discord.dev.active) {
            if (include.length)
                files = files.filter((file) =>
                    include.includes(path.parse(file).base)
                );
            if (exclude.length)
                files = files.filter(
                    (file) => !exclude.includes(path.parse(file).base)
                );
        }
        for (const file of files) {
            const filePath = path.resolve(file);
            const fileName = path.basename(filePath, path.extname(filePath));
            const filePathDir = path.dirname(filePath);
            if (fileName === command)
                return dir ? (Path = filePathDir) : (Path = filePath);
            else continue;
        }
        return Path;
    }
    /**
     * Reload a command
     * @param commandName The command to reload
     */
    public reload(
        commandName: string = this.help.name
    ): Promise<Message> | void {
        if (
            !(
                this.client.commands.has(commandName) ||
                this.client.aliases.has(commandName)
            )
        )
            return this.message?.channel.send("This command doesn't exist.");
        const cmdPath = this.trace({ command: commandName });
        // Dunno how to do this without require
        delete require.cache[require.resolve(cmdPath as string)];
        this.client.commands.delete(commandName);
        // Cannot use import :<
        const command: Command = new (require(cmdPath as string))(this.client);
        if (this.client.commands.has(command.help.name)) {
            console.error(
                new Error(`Command name duplicate: ${command.help.name}`).stack
            );
            process.exit(1);
        }
        this.client.commands.set(commandName, command);
    }
    /**
     * Unload a command
     * @param commandName The command to unload
     */
    public unload(commandName: string = this.help.name): void {
        const cmdPath = this.trace({ command: commandName });
        delete require.cache[require.resolve(cmdPath as string)];
        this.client.commands.delete(commandName);
    }

    public load(commandName: string): void {
        const cmdPath = this.trace({ command: commandName }) as string;
        const command: Command = new (require(cmdPath))(this.client);
        this.client.commands.set(commandName, command);
    }

    public setMessage(message: Message): void {
        this.message = message;
    }

    public execute(...args: any[]): Promise<Message | void | string> | Message | void | string {
        throw new Error(
            `${this.help.name} dosen\'t have an execute() method !`
        );
    }
}
