/* eslint-disable no-console */
import { Message } from 'discord.js';
import Client from './Client';
import { EventOptions, Listener, ClientEvents } from './interfaces/Event';

export default class Event {
    public readonly client: Client;
    public name: ClientEvents;
    public type: string;
    public emitter: Listener;
    constructor(client: Client, options: EventOptions) {
        this.client = client;
        this.name = options.name;
        this.type = options.once ? 'once' : 'on';
        this.emitter =
            typeof options.emitter === 'string'
                ? this.client[options.emitter]
                : (options.emitter as Listener) ||
                  (this.client as unknown as Listener);
        this._validate(options);
    }
    public execute(
        ..._args: unknown[]
    ): Promise<void | Message> | void | Message {
        throw new Error(`${this.name} doesn't have an execute() method!`);
    }
    private _validate(data: EventOptions): void {
        const events = [
            'applicationCommandCreate',
            'applicationCommandDelete',
            'applicationCommandUpdate',
            'channelCreate',
            'channelDelete',
            'channelPinsUpdate',
            'channelUpdate',
            'debug',
            'emojiCreate',
            'emojiDelete',
            'emojiUpdate',
            'error',
            'guildBanAdd',
            'guildBanRemove',
            'guildCreate',
            'guildDelete',
            'guildIntegrationsUpdate',
            'guildMemberAdd',
            'guildMemberAvailable',
            'guildMemberRemove',
            'guildMembersChunk',
            'guildMemberUpdate',
            'guildUnavailable',
            'guildUpdate',
            'interaction',
            'interactionCreate',
            'invalidated',
            'invalidRequestWarning',
            'inviteCreate',
            'inviteDelete',
            'message',
            'messageCreate',
            'messageDelete',
            'messageDeleteBulk',
            'messageReactionAdd',
            'messageReactionRemove',
            'messageReactionRemoveAll',
            'messageReactionRemoveEmoji',
            'messageUpdate',
            'presenceUpdate',
            'rateLimit',
            'ready',
            'roleCreate',
            'roleDelete',
            'roleUpdate',
            'shardDisconnect',
            'shardError',
            'shardReady',
            'shardReconnecting',
            'shardResume',
            'stageInstanceCreate',
            'stageInstanceDelete',
            'stageInstanceUpdate',
            'stickerCreate',
            'stickerDelete',
            'stickerUpdate',
            'threadCreate',
            'threadDelete',
            'threadListSync',
            'threadMembersUpdate',
            'threadMemberUpdate',
            'threadUpdate',
            'typingStart',
            'userUpdate',
            'voiceStateUpdate',
            'warn',
            'webhookUpdate',
        ];
        if (!data.name) {
            console.error(new Error("This event dosen't have any name."));
            process.exit(1);
        }
        if (!events.includes(data.name as unknown as string)) {
            console.error(new Error('This event is not a part of the events!'));
            process.exit(1);
        }
    }
}
