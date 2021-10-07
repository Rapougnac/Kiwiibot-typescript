import {
    Base,
    SnowflakeUtil,
    User,
    Guild,
    Channel,
    GuildMember,
    Snowflake,
} from 'discord.js';
import { InteractionTypes, MessageComponentTypes } from '../../util/constants';
import Client from '../Client';

export default class Interaction extends Base {
    /**
     * The interaction's type
     */
    public type: string;
    /**
     * The interaction's id
     */
    public id: Snowflake;
    /**
     * The interaction's token
     * @name Interaction#token
     */
    public readonly token!: string;
    /**
     * The application's id
     */
    public applicationId: Snowflake;
    /**
     * The id of the channel this interaction was sent in.
     */
    public channelId: Snowflake | null;
    /**
     * The id of the guild this interaction was sent in.
     */
    public guildId: Snowflake | null;
    /**
     * The user wich sent this interaction
     */
    public user: User;
    /**
     * If the interaction was sent in a guild, the member wich sent it.
     */
    public member: GuildMember | null;
    /**
     * The version
     */
    public version: number;
    constructor(client: Client, data: any) {
        super(client);
        this.type = InteractionTypes[data.type];
        this.id = data.id;
        Object.defineProperty(this, 'token', { value: data.token });
        this.applicationId = data.application_id;
        this.channelId = data.channel_id;
        this.guildId = data.guild_id;
        this.user = this.client.users.add(data.user ?? data.member.user);
        this.member = data.member
            ? this.guild?.members.add(data.member) ?? data.member
            : null;
        this.version = data.version;
    }

    get createdTimestamp(): number {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }

    get createdAt(): Date {
        return new Date(this.createdTimestamp);
    }

    /**
     * The channel this interaction was sent in
     */
    get channel(): Channel | null {
        return this.client.channels.cache.get(this.channelId as string) ?? null;
    }

    /**
     * The guild this interaction was sent in
     */
    get guild(): Guild | null {
        return this.client.guilds.cache.get(this.guildId as string) ?? null;
    }

    /**
     * Indicates whether this interaction is received from a guild.
     */
    inGuild(): boolean {
        return Boolean(this.guildId && this.member);
    }

    /**
     * Indicates whether this interaction is a {@link CommandInteraction}.
     */
    isCommand(): boolean {
        return (
            InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND
        );
    }
}
