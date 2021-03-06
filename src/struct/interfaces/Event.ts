import type KiwiiClient from '../Client';
import type Event from '../Event';
export interface EventOptions {
  /**
   * If the event is triggered `<Event>.once();` instead of `<Event>.on();`
   */
  once?: boolean;
  /**
   * The emitter of the event
   */
  emitter?: Listener;
  /**
   * The name of the event
   */
  name: ClientEvents;
}

export interface Listener {
  on(...args: unknown[]): void;
  once(...args: unknown[]): void;
}
export interface EventConstructor {
  // eslint-disable-next-line no-unused-vars
  new (client: KiwiiClient, options?: EventOptions): Event;
  default: EventConstructor;
  readonly prototype: Event;
}
export type ClientEvents =
  | 'applicationCommandCreate'
  | 'applicationCommandDelete'
  | 'applicationCommandUpdate'
  | 'channelCreate'
  | 'channelDelete'
  | 'channelPinsUpdate'
  | 'channelUpdate'
  | 'debug'
  | 'emojiCreate'
  | 'emojiDelete'
  | 'emojiUpdate'
  | 'error'
  | 'guildBanAdd'
  | 'guildBanRemove'
  | 'guildCreate'
  | 'guildDelete'
  | 'guildIntegrationsUpdate'
  | 'guildMemberAdd'
  | 'guildMemberAvailable'
  | 'guildMemberRemove'
  | 'guildMembersChunk'
  | 'guildMemberUpdate'
  | 'guildUnavailable'
  | 'guildUpdate'
  | 'interaction'
  | 'interactionCreate'
  | 'invalidated'
  | 'invalidRequestWarning'
  | 'inviteCreate'
  | 'inviteDelete'
  | 'message'
  | 'messageCreate'
  | 'messageDelete'
  | 'messageDeleteBulk'
  | 'messageReactionAdd'
  | 'messageReactionRemove'
  | 'messageReactionRemoveAll'
  | 'messageReactionRemoveEmoji'
  | 'messageUpdate'
  | 'presenceUpdate'
  | 'rateLimit'
  | 'ready'
  | 'roleCreate'
  | 'roleDelete'
  | 'roleUpdate'
  | 'shardDisconnect'
  | 'shardError'
  | 'shardReady'
  | 'shardReconnecting'
  | 'shardResume'
  | 'stageInstanceCreate'
  | 'stageInstanceDelete'
  | 'stageInstanceUpdate'
  | 'stickerCreate'
  | 'stickerDelete'
  | 'stickerUpdate'
  | 'threadCreate'
  | 'threadDelete'
  | 'threadListSync'
  | 'threadMembersUpdate'
  | 'threadMemberUpdate'
  | 'threadUpdate'
  | 'typingStart'
  | 'userUpdate'
  | 'voiceStateUpdate'
  | 'warn'
  | 'webhookUpdate';
