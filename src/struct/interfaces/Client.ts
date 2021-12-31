import type {
  ClientOptions,
  PermissionString,
  PresenceStatusData,
} from 'discord.js';
import _ServerInfoCommand from '../../commands/infos/serverinfo';
import type { ClientEvents } from './Event';

export interface Config {
  /**
   * The domain of the session
   * @note Not using
   */
  domain: string;
  /**
   * The port of the session
   */
  port: number;
  /**
   * If using custom domain
   */
  usingCustomDomain: boolean;
  /**
   * The client's secret
   */
  clientSecret: string;
  /**
   * The options related to discord
   */
  discord: {
    /**
     * The token of the bot
     */
    token: string;
    /**
     * The presence of the bot
     */
    status: PresenceStatusData;
    /**
     * The default permissions of the bot
     */
    defaultPerms: PermissionString[];
    /**
     * The options related to discord dev
     */
    dev: {
      /**
       * If there are commands to includes
       */
      include_cmd: string[];
      /**
       * If there are commands to exclude
       */
      exclude_cmd: string[];
      /**
       * Whether or not active these options
       */
      active: boolean;
      /**
       * Whether or not the bot is in debug mode
       */
      debug: boolean;
    };
  };
  /**
   * I'll not get in details about this
   */
  emojis: {
    off: string;
    error: string;
    queue: string;
    music: string;
    success: string;
  };
  /**
   * The ytsearcher key
   * @note Not using
   */
  ytsearcher: {
    key: string;
  };
  /**
   * The genius lyrics options
   */
  genius_lyrics: {
    /**
     * The token of the genius lyrics
     */
    TOKEN: string;
  };
  /**
   * The amethyste object
   */
  amethyste: {
    /**
     * The token of the api
     */
    client: string;
  };
  /**
   * Filters that can be added to the music
   */
  filters: string[];
  /**
   * The channels where some dark things \~happend\~
   */
  channels: {
    /**
     * The debug channel
     */
    debug: string;
    /**
     * The logs channel
     */
    logs: string;
  };
  /**
   * The clientMap object
   */
  clientMap: {
    /**
     * Represented as 🌐
     */
    web: string;
    /**
     * Represented as 📱
     */
    mobile: string;
    /**
     * Represented as 💻
     */
    desktop: string;
  };
  /**
   * This is just hex colors
   * @note Not using
   */
  colors: {
    base: string;
    positive: string;
    neutral: string;
    negative: string;
  };
  /**
   * The object related to mongodb - mongoose
   */
  database: {
    /**
     * Whether or not activate the database
     */
    enable: boolean;
    /**
     * The URI of the connection
     */
    URI: string;
    /**
     * The mongoose options
     */
    config: {
      useUnifiedTopology: boolean;
      useNewUrlParser: boolean;
      autoIndex: boolean;
      connectTimeoutMS: number;
    };
  };
  /**
   * This is just for the {@link _ServerInfoCommand ServerInfoCommand}
   */
  verificationLVL: {
    NONE: string;
    LOW: string;
    MEDIUM: string;
    HIGH: string;
    VERY_HIGH: string;
  };
  /**
   * Chatbot
   * @note Not using
   */
  chatbot: {
    id: string;
    key: string;
  };

  MAL: {
    username: string;
    password: string;
  };

  kiwii: {
    apiKey: string;
  };

  mysql: DataBaseOptions;

  /**
   * Private guilds to use the private commands. (By theirs id)
   */
  privateGuilds?: string[];
}

export interface KiwiiClientOptions {
  /**
   * The prefix of the bot
   */
  prefix: string;
  /**
   * The config file
   *
   */
  config: Config;
  /**
   * The base options of the client
   */
  clientOptions: ClientOptions;
  /**
   * If there should be events that not triggers
   */
  disabledEvents?: ClientEvents[];
  /**
   * The owner(s) of the bot, by theirs ids
   */
  owners: string | string[];

  /**
   * The database
   */
  database?: DataBaseOptions;

  /**
   * Whether or not to enable typescript with ts-node
   */
  typescript?: boolean;
}

export interface ProcessEventOptions {
  /**
   * Logs the error on the console
   */
  log_on_console: boolean;

  /**
   * No error sended both on the channel & the console
   */
  nologs: boolean;

  /**
   * Logs the error on the console & the channel
   */
  logsonboth: boolean;
}

/**
 * The database options
 */
export interface DataBaseOptions {
  /**
   * The host of the database
   * @default 'localhost'
   */
  host?: string;

  /**
   * The password of the database
   * @default ''
   */
  password?: string;

  /**
   * The database name
   * @default 'test'
   */
  database?: string;

  /**
   * The username of the database
   * @default ''
   */
  user?: string;
}
