import {
    Client,
    ClientApplication,
    ClientOptions,
    Collection,
    User,
    UserResolvable,
} from 'discord.js';
import Command from './Command';
import {
    Config,
    KiwiiClientOptions,
    EventConstructor,
    ProcessEventOptions,
} from './interfaces/main';
import SlashCommand from './SlashCommand';
import Event from './Event';
import Util from './Util';
import axios from 'axios';
import * as Console from '../util/console';
import { Player } from 'discord-player';
import glob from 'glob';
import * as path from 'path';
import { readdir, readdirSync } from 'fs';
//@ts-ignore: Don't have any typings
import * as ascii from 'ascii-table';
import mongoose from 'mongoose';
import ProcessEvent from '../util/processEvent';
let table = new ascii('Events');
let table2 = new ascii('Player Events');
/**
 * Represents a discord client
 * @extends Client
 */
export default class KiwiiClient extends Client {
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
    public cooldowns: Collection<string, number>;
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
     * The player manager of the client
     */
    public readonly player: Player;
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
    /**
     * Get the filters in config
     */
    public filters: string[];
    /**
     * Client application
     */
    public application: ClientApplication | null;
    constructor(options: KiwiiClientOptions) {
        super(options.clientOptions);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.categories = new Set();
        this.slashs = new Collection();
        this.events = new Collection();
        this.utils = new Util(this);
        this.config = options.config;
        this.owners = options.owners;
        this.prefix = options.prefix;
        this.disabledEvents = options.disabledEvents || [];
        // I hate this thing of dumb ideas
        this.player = new Player(this as unknown as Client, {
            autoSelfDeaf: true,
            enableLive: true,
            leaveOnEnd: true,
            leaveOnEndCooldown: 45000,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 5000,
        });
        this.emotes = this.config.emojis;
        this.filters = this.config.filters;
        this.application = null;
        this.fetchApplication().then((app) => (this.application = app));
        Console.success(
            `Client has been initialized, you're using ${process.version}`
        );
        //@ts-ignore
        Array.prototype.remove = function () {
            let what,
                a = arguments,
                L = a.length,
                ax;

            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };
    }

    /**
     * Log the client in
     * @param token The token used to log
     */
    //@ts-ignore
    public login(token: string | undefined = this.config.discord.token): KiwiiClient {
        // Log super in with the supplied token
        super.login(token);

        return this;
    }
    /**
     * Load all commands in the specified directory
     */
    public loadCommands(): this {
        let files = glob.sync('./dist/src/commands/**/*.js');
        const exclude = this.config.discord.dev.exclude_cmd;
        const include = this.config.discord.dev.include_cmd;
        if (this.config.discord.dev.active) {
            if (include.length) {
                files = files.filter((file) =>
                    include.includes(path.parse(file).base)
                );
            }
            if (exclude.length) {
                files = files.filter(
                    (file) => !exclude.includes(path.parse(file).base)
                );
            }
        }
        files.forEach(async (file) => {
            try {
                const filePath = `${process.cwd()}${path.sep}${file}`;
                let command: Command | null = await import(filePath);
                if (this.utils.isClass(command)) {
                    command = new (await import(filePath))(this);
                    if (this.commands.has(command!.help.name)) {
                        console.error(
                            new Error(
                                `Command name duplicate: ${command!.help.name}`
                            ).stack
                        );
                        return process.exit(1);
                    }
                    this.commands.set(command!.help.name, command as Command);
                    if (
                        command!.help.category === '' ||
                        !command!.help.category
                    )
                        command!.help.category = 'unspecified';
                    this.categories.add(command!.help.category);

                    if (command!.config.aliases) {
                        command!.config.aliases.forEach((alias) => {
                            if (this.aliases.has(alias)) {
                                console.error(
                                    new Error(
                                        `Alias name duplicate: ${
                                            command!.config.aliases
                                        }`
                                    ).stack
                                );
                                return process.exit(1);
                            } else {
                                this.aliases.set(alias, command as Command);
                            }
                        });
                    }
                } else {
                    command = null;
                }
            } catch (error) {
                console.error(error);
            }
        });
        setTimeout(
            (commands) => {
                Console.success(`Loaded ${commands} commands`);
            },
            1000,
            this.commands.size
        );
        return this;
    }
    /**
     * Load all events in the specified directory
     */
    public loadEvents(): this {
        readdir('./dist/src/events', (err, files) => {
            if (err) throw err;
            if (this.disabledEvents.length) {
                for (const event of this.disabledEvents) {
                    files = files.filter((file) => !file.startsWith(event));
                }
            }
            files = files.filter((file) => file.endsWith('.js'));
            files.forEach(async (file) => {
                let event = await import(`../events/${file}`);
                if (this.utils.isClass(event)) {
                    event = new event(this);
                    this.events.set(event.name, event);
                    event.emitter[event.type](event.name, (...args: any) =>
                        event.execute(...args)
                    );
                    if (event.name) {
                        table.addRow(event.name, 'Ready');
                    } else {
                        table.addRow(event.name, '\x1b[31mERR!\x1b[0m');
                    }
                }
            });
            console.log(table.toString());
        });
        return this;
    }
    public mongoInit() {
        mongoose
            .connect(this.config.database.URI, this.config.database.config)
            .then(() => {
                Console.success(`Connected to MongoDB`, 'MongoDB');
            })
            .catch((e) => {
                Console.error('Failed to connect to MongoDB', e);
            });
    }
    /**
     * Load all player events in the specified directory
     */
    public playerInit() {
        const player = readdirSync('src/events/player').filter((file) =>
            file.endsWith('.js')
        );
        for (const file of player) {
            const event = require(`../../src/events/player/${file}`);
            const eventName = file.split('.')[0];
            this.player.on(eventName, event.bind(null, this));
            if (eventName) {
                table2.addRow(eventName, 'Ready');
            } else {
                table2.addRow(eventName, '\x1b[31mERR!\x1b[0m');
            }
        }
        console.log(table2.toString());
        return this;
    }
    /**
     * Listener for process events.
     * @param events The process event name to listen to
     * @param config The configuration for the process events.
     */
    public listentoProcessEvents(events: string[], config: ProcessEventOptions): void {
        if (!Array.isArray(events)) {
            throw new Error('Event must be an array!');
        }

        for (const event of events) {
            process.on(event, (...args) => {
                if (
                    config.log_on_console &&
                    typeof config.log_on_console === 'boolean'
                ) {
                    return console.error(args[0].stack);
                } else if (
                    config.nologs &&
                    typeof config.nologs === 'boolean'
                ) {
                    return;
                } else if (
                    config.logsonboth &&
                    typeof config.logsonboth === 'boolean'
                ) {
                    if (args[0].message === 'Unknown User') return;
                    console.error(args[0].stack);
                    return ProcessEvent(
                        event as unknown as Record<string, any>,
                        args,
                        this
                    );
                } else {
                    return ProcessEvent(
                        event as unknown as Record<string, any>,
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
        this.playerInit().loadEvents().loadCommands();

        //Mongodb
        if (this.config.database.enable) {
            this.mongoInit();
        } else {
            mongoose.disconnect();
            Console.warn(
                'Database is not enabled! Some commands may cause dysfunctions, please active it in the config.json!'
            );
        }
        return this;
    }
    /**
     * Checks whether a user is an owner of the bot (in {@link KiwiiClientOptions.owners})
     * @param user - User to check for the ownership
     */
    public isOwner(user: UserResolvable): boolean {
        if (!this.owners) return false;
        user = this.users.resolve(user) as User;
        if (!user) throw new RangeError('Unable to resolve the user.');
        if (typeof this.owners === 'string') return user.id === this.owners;
        if (this.owners instanceof Array) return this.owners.includes(user.id);
        throw new RangeError(
            'The client\'s "owner" option is an unknown value.'
        );
    }

    /**
     * Fetch the user via the api to get their properties.
     * @param user - User to fetch via the api.
     */
    public async fetchUserViaAPI(user: UserResolvable): Promise<object> {
        user = this.users.resolve(user) as User;
        if (!user)
            throw new RangeError('Please, give me a valid user to resolve.');
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
