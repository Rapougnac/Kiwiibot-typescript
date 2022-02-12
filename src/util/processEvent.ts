import type { Message } from 'discord.js';
import type Client from '../struct/Client';

/**
 * Handle unhandledRejection
 * @param error The error object
 * @param args other arguments passed through the event
 * @param Client
 */
function unhandledRejection(
  [error]: [Error],
  client: Client
): Promise<Message | Error | void> {
  const channel = client.channels.cache.get(client.config.channels.debug);
  const d = new Date(),
    timedate = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/'),
    timehrs = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

  if (!channel) {
    return Promise.resolve(error);
  }

  //@ts-expect-error: Constant id, so it's always a TextChannel
  return channel.send(
    `\\🛠 ${error.name} caught!\n\`The ${timedate} at ${timehrs}\`\n\`\`\`xl\n${
      error.stack ?? 'No stack thrown'
    }\`\`\``
  );
}

/**
 * Handle uncaughtException
 * @param {Error} error The error object
 * @param {*} args other arguments passed through the event
 * @returns {Promise<Message|undefined>}
 */
function uncaughtException(
  [error]: [Error],
  client: Client
): Promise<Message | Error | void> {
  const channel = client.channels.cache.get(client.config.channels.debug);
  const d = new Date(),
    timedate = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/'),
    timehrs = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
  if (!channel) {
    return Promise.resolve(error);
  }

  //@ts-expect-error: Constant id, so it's always TextChannel
  return channel.send(
    `\\🛠 ${error.name} caught!\n\`At ${timedate} at ${timehrs}\`\n\`\`\`xl\n${
      error.stack ?? 'No stack thrown'
    }\`\`\``
  );
}

// registered functions to use
const registers = { unhandledRejection, uncaughtException };

export default function processEvents(
  event: 'unhandledRejection' | 'uncaughtException',
  args: [Error],
  client: Client
) {
  return registers[event](args, client);
}
