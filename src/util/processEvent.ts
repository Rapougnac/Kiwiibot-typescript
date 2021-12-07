import { Message } from 'discord.js';
import Client from '../struct/Client';
import * as consoleUtil from './console';

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore: Constant id, so it's always a TextChannel
    return channel.send(
        `\\🛠 ${error.name} caught!\n\`The ${timedate} at ${timehrs}\`\n\`\`\`xl\n${error.stack}\`\`\``
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore: Constant id, so it's always TextChannel
    return channel.send(
        `\\🛠 ${error.name} caught!\n\`At ${timedate} at ${timehrs}\`\n\`\`\`xl\n${error.stack}\`\`\``
    );
}

// registered functions to use
const registers = { unhandledRejection, uncaughtException };

export default function processEvents(
    event: 'unhandledRejection' | 'uncaughtException',
    args: [Error],
    client: Client
) {
    if (registers[event]) {
        return registers[event](args, client);
    } else {
        return consoleUtil.warn(
            `Function for process#event \`${event}\` not registered at ${__filename}`,
            '[BOT PROCESS]'
        );
    }
}
