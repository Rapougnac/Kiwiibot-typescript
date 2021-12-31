/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserResolvable } from 'discord.js';
import { Collection, Guild, Client } from 'discord.js';
import type Command from './Command';
import type {
  Config,
  KiwiiClientOptions,
  EventConstructor,
  ProcessEventOptions,
  ConstructorCommand,
} from './interfaces/main';
import type SlashCommand from './SlashCommand';
import type Event from './Event';
import Util from './Util';
import axios from 'axios';
import * as Console from '../util/console';
import glob from 'glob';
import * as path from 'path';
import { readdirSync } from 'fs';
import ProcessEvent from '../util/processEvent';
import '../util/NativeExtended';
import { sep } from 'path';
import InteractionManager from './InteractionManager';
import MYSql from './MySql';
/**
 * Represents a discord client
 * @extends Client
 */
// prettier-ignore
export default class KiwiiClient<Ready extends boolean = boolean> extends Client<Ready> {
  /**
   * A collection of all the bot's commands
   */
  public readonly commands: Collection<string, Command>;
  /**
   * A collection array of all the bot's command aliases
   */
  public readonly aliases: Collection<string, Command>;
  /**
   * A collection of the cooldowns cached
   */
  public cooldowns: Collection<string, Collection<string, number>>;
  /**
   * A set of the command's categories
   */
  public categories: Set<string>;
  /**
   * A collection of all the bot's slash commands
   */
  public readonly slashs: Collection<string, SlashCommand>;
  /**
   * A collection of all the bot's events
   */
  public readonly events: Collection<string, Event>;
  /**
   * The manager of the `Util` class
   */
  public utils: Util;
  /**
   * The bot configuration file
   */
  public readonly config: Config;
  /**
   * The bot owner(s)
   */
  public owners: string | string[];
  /**
   * Acess to the prefix easily
   */
  public prefix: string;
  /**
   * The events that should not be executed
   */
  public disabledEvents: string[];
  /**
   * Get the emojis in config
   */
  public emotes: {
    off: string;
    error: string;
    queue: string;
    music: string;
    success: string;
  };

  public mappedCategories: Collection<
    string,
    Array<Collection<string, Command>>
  >;

  /**
   * Get the filters in config
   */
  public filters: string[];

  /**
   * The interaction manager
   */
  public interactionManager: InteractionManager;

  /**
   * The mysql manager
   */
  public mySql: MYSql;

  /**
   * Whether to enable typescript with ts-node
   */
  private typescript: boolean;

  /**
   * The main client.
   * @param options The options of the client
   */
  constructor(options: KiwiiClientOptions) {
    super(options.clientOptions);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.cooldowns = new Collection();
    this.categories = new Set();
    this.slashs = new Collection();
    this.events = new Collection();
    this.config = options.config;
    this.mappedCategories = new Collection();
    this.utils = new Util(this);
    this.owners = options.owners;
    this.prefix = options.prefix;
    this.disabledEvents = options.disabledEvents || [];
    this.emotes = this.config.emojis;
    this.filters = this.config.filters;
    Console.success(
      `Client has been initialized, you're using ${process.version}`
    );
    Guild.prototype.prefix = this.prefix;
    this.interactionManager = new InteractionManager(this);
    this.mySql = new MYSql(options.database);
    this.typescript = options.typescript ?? false;
  }

  /**
   * Log the client in
   * @param token The token used to log
   */
  public async connect(
    token: string | undefined = this.config.discord.token
  ): Promise<this | Error> {
    if (!token)
      Promise.reject(new Error('No token provided')).finally(() =>
        this.destroy()
      );
    // Log super in with the supplied token
    // eslint-disable-next-line no-console
    await super.login(token).catch(console.error);

    return this;
  }
  /**
   * Load all commands in the specified directory
   */
  public loadCommands(): this {
    let files = this.typescript ? glob.sync('./src/commands/**/*.ts') : glob.sync('./dist/src/commands/**/*.js');
    const exclude = this.config.discord.dev.exclude_cmd;
    const include = this.config.discord.dev.include_cmd;
    if (this.config.discord.dev.active) {
      if (include.length) {
        files = files.filter((file) => include.includes(path.parse(file).base));
      }
      if (exclude.length) {
        files = files.filter(
          (file) => !exclude.includes(path.parse(file).base)
        );
      }
    }
    files.forEach((file) => {
      void (async () => {
        try {
          const filePath = path.resolve(`${process.cwd()}${path.sep}${file}`);
          const Command = await import(`${filePath}`).then((c: ConstructorCommand) => c.default);
          if (this.utils.isClass(Command)) {
            const command = new Command(this);
            if (this.commands.has(command.help.name)) {
              // eslint-disable-next-line no-console
              console.error(
                new Error(`Command name duplicate: ${command.help.name}`).stack
              );
              return process.exit(1);
            }
            this.commands.set(command.help.name, command);
            if (command.help.category === '' || !command.help.category)
              command.help.category = 'unspecified';
            this.categories.add(command.help.category);

            Array.from(this.categories).forEach((category) => {
              this.mappedCategories.set(category, [
                this.commands.filter((c) => c.help.category === category),
              ]);

              this.mappedCategories.set(category, [
                category,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(this.mappedCategories.get(category) as any),
              ]);
            });

            if (command.config.aliases.length) {
              command.config.aliases.forEach((alias) => {
                if (this.aliases.has(alias)) {
                  // eslint-disable-next-line no-console
                  console.error(
                    new Error(`Alias name duplicate: ${command.config.aliases}`)
                      .stack
                  );
                  return process.exit(1);
                } else {
                  this.aliases.set(alias, command);
                }
              });
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error((error as { stack?: string }).stack);
        }
      })();
    });

    Console.success(`Loaded ${files.length} commands`);
    return this;
  }
  /**
   * Load all events in the specified directory
   */
  public loadEvents(): this {
    const evts: {
      name: string;
      state: string;
    }[] = [];
    let files = this.typescript ? readdirSync('./src/events') : readdirSync('./dist/src/events');
    if (this.disabledEvents.length) {
      for (const event of this.disabledEvents) {
        files = files.filter((file) => !file.startsWith(event));
      }
    }
    files = files.filter((file) => this.typescript ? file.endsWith('.ts') :file.endsWith('.js'));
    files.forEach((file) => {
      void (async () => {
        const path = `${process.cwd()}${sep}${this.typescript ? '' : `dist${sep}`}src${sep}events${sep}${file}`;
        const Event = await import(`${path}`).then((event: EventConstructor) => event.default);
        if (this.utils.isClass(Event)) {
          const event = new Event(this);
          this.events.set(event.name, event);
          (event.emitter)[event.type](event.name, (...args: any) =>
            event.execute(...args)
          );
          evts.push({
            name: event.name,
            state: '🟢Ready',
          });
        }
      })();
    });
    setTimeout(() => Console.table(evts), 500);
    return this;
  }
  /**
   * Listener for process events.
   * @param events The process event name to listen to
   * @param config The configuration for the process events.
   */
  public listentoProcessEvents(
    events: string[],
    config: ProcessEventOptions
  ): void {
    if (!Array.isArray(events)) {
      throw new Error('Event must be an array!');
    }

    for (const event of events) {
      process.on(event, (...args) => {
        if (
          config.log_on_console &&
          typeof config.log_on_console === 'boolean'
        ) {
          // eslint-disable-next-line no-console
          return console.error(args[0].stack);
        } else if (
          config.nologs &&
          typeof config.nologs === 'boolean'
          // eslint-disable-next-line no-empty
        ) {
        } else if (
          config.logsonboth &&
          typeof config.logsonboth === 'boolean'
        ) {
          if (args[0].message === 'Unknown User') return;
          // eslint-disable-next-line no-console
          console.error(args[0].stack);
          return void ProcessEvent(
            event as 'uncaughtException' | 'unhandledRejection',
            // @ts-expect-error: Same as below
            args,
            this
          );
        } else {
          return void ProcessEvent(
            event as 'uncaughtException' | 'unhandledRejection',
            // @ts-expect-error: Ugn, types...
            args,
            this
          );
        }
      });
    }
  }
  /**
   * Function to start the bot
   */
  public start() {
    //Load the events, player events and commands
    this.loadEvents().loadCommands();
    return this;
  }
  /**
   * Checks whether a user is an owner of the bot (in {@link KiwiiClientOptions.owners})
   * @param user - User to check for the ownership
   */
  public isOwner(user: UserResolvable | null): boolean {
    if (!user) return false;
    if (!this.owners) return false;
    user = this.users.resolve(user);
    if (!user) throw new RangeError('Unable to resolve the user.');
    if (typeof this.owners === 'string') return user.id === this.owners;
    if (this.owners instanceof Array) return this.owners.includes(user.id);
    throw new RangeError('The client\'s "owner" option is an unknown value.');
  }

  /**
   * Fetch the user via the api to get their properties.
   * @param user - User to fetch via the api.
   */
  public async fetchUserViaAPI(user: UserResolvable | null): Promise<object> {
    if (!user) return {};
    user = this.users.resolve(user);
    if (!user) throw new RangeError('Please, give me a valid user to resolve.');
    const data = await axios.get(
      `https://discord.com/api/v9/users/${user.id}`,
      {
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      }
    );
    return data;
  }
}
