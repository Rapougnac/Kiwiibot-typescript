import { Client, ClientOptions, Collection } from 'discord.js';
import Command from './Command';
import { Config, KiwiiClientOptions } from './interfaces/Client';
import SlashCommand from './SlashCommand';
import Event from './Event';
import Util from './Util';
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
    }
}
