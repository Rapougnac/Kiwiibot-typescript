import type { Message } from 'discord.js';
import { Collection } from 'discord.js';
import type Client from './Client';
import type {
  CommandOptions,
  HelpOptions,
  ConfigOptions,
  TraceOptions,
  ConstructorCommand,
} from './interfaces/Command';
import glob from 'glob';
import * as path from 'path';

export default abstract class Command {
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
      permissions: options.permissions || ['SEND_MESSAGES', 'VIEW_CHANNEL'],
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
      private: options.private || false,
      fileName: options.fileName || this.help.name,
    };
    this.cooldown = new Collection();
    this.message = null;
  }
  /**
   * Trace the command
   */
  private trace({
    command = this.config.fileName,
    dir = false,
  }: TraceOptions): string | undefined {
    let files = (this.client as unknown as { typescript: boolean }).typescript
      ? glob.sync('./src/commands/**/*.ts')
      : glob.sync('./dist/src/commands/**/*.js');
    let Path: string | undefined;
    const exclude = this.client.config.discord.dev.exclude_cmd;
    const include = this.client.config.discord.dev.include_cmd;
    if (this.client.config.discord.dev.active) {
      if (include.length)
        files = files.filter((file) => include.includes(path.parse(file).base));
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
  public async reload(
    commandName: string = this.help.name
  ): Promise<Message | void> {
    if (
      !(
        this.client.commands.has(commandName) ||
        this.client.aliases.has(commandName)
      )
    )
      return this.message?.channel.send("This command doesn't exist.");
    const cmdPath = this.trace({ command: commandName });
    if (!cmdPath)
      return this.message?.channel.send("This command doesn't exist.");
    // Dunno how to do this without require
    delete require.cache[require.resolve(cmdPath)];
    this.client.commands.delete(commandName);
    const Command: ConstructorCommand = await import(`${cmdPath}`).then(
      (command: ConstructorCommand) => command.default
    );
    const command = new Command(this.client);
    if (this.client.commands.has(command.help.name)) {
      // eslint-disable-next-line no-console
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
  public async unload(
    commandName: string = this.help.name
  ): Promise<Message<boolean> | void> {
    if (
      !(
        this.client.aliases.has(commandName) ||
        this.client.commands.has(commandName)
      )
    )
      return this.message?.channel.send("This command doesn't exist.");
    const cmdPath = this.trace({ command: commandName });
    if (!cmdPath)
      return this.message?.channel.send("This command doesn't exist.");
    delete require.cache[require.resolve(cmdPath)];
    this.client.commands.delete(commandName);
  }

  public async load(commandName: string): Promise<Message<boolean> | void> {
    if (
      !(
        this.client.aliases.has(commandName) ||
        this.client.commands.has(commandName)
      )
    )
      return this.message?.channel.send("This command doesn't exist.");
    const cmdPath = this.trace({ command: commandName });
    if (!cmdPath)
      return this.message?.channel.send("This command doesn't exist.");
    const Command: ConstructorCommand = await import(`${cmdPath}`).then(
      (command: ConstructorCommand) => command.default
    );
    const command = new Command(this.client);
    this.client.commands.set(commandName, command);
  }

  public setMessage(message: Message): void {
    this.message = message;
  }

  public execute(
    ..._args: unknown[]
  ): Promise<Message | void | string> | Message | void | string {
    throw new Error(`${this.help.name} doesn't have an execute() method !`);
  }
}
