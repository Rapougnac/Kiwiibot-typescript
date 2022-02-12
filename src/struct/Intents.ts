import { Intents as DontLikeTheseIntentsMineAreWayBetter } from 'discord.js';

export default class Intents extends DontLikeTheseIntentsMineAreWayBetter {
  /**
   * Bitfield representing all intents combined.
   */
  static ALL: number = Object.values(Intents.FLAGS).reduce((a, b) => a | b, 0);
}
