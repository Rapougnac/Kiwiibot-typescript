import type { Message, CommandInteraction } from 'discord.js';

export interface StartOptions {
  /**The length of the loading bar */
  length?: number;
  /**The time to wait in milliseconds before each refresh of the bar */
  time?: number;
  /**If it should send with message using discord.js */
  allowMessage?: boolean;
  /**The Message object*/
  message?: Message;
  /**The start of the progress bar */
  start?: string;
  /**The end of the progress bar */
  end?: string;
  /**The empty string of the progress bar */
  empty?: string;
  /**The full string of the progress bar */
  full?: string;
  /**If it should delete the bar after completed */
  deleteMessage?: boolean;
  /**If it should delete the message after a time */
  timeoutMessage?: number;
  /**The interaction */
  interaction?: CommandInteraction;
}
