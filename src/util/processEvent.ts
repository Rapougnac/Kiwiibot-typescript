import { Message } from 'discord.js';
import Client from '../struct/Client';
import * as consoleUtil from './console';

/**
 * Handle unhandledRejection
 * @param {Error} error The error object
 * @param {*} args other arguments passed through the event
 * @param {Client} client Client
 * @returns {Promise<Message|undefined>}
 */
function unhandledRejection(
    [error, ..._args]: [any, ...any],
    client: Client
): Promise<Message | undefined> | Promise<void> {
    const channel = client.channels.cache.get(client.config.channels.debug);
    const d = new Date(),
        timedate = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/'),
        timehrs = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

    if (!channel) {
        return Promise.resolve(console.log(error));
    }

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
    [error, ..._args]: [any, ...any],
    client: Client
): Promise<Message | undefined> | Promise<void> {
    const channel = client.channels.cache.get(client.config.channels.debug);
    const d = new Date(),
        timedate = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/'),
        timehrs = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    if (!channel) {
        return Promise.resolve(console.log(error));
    }
    //@ts-ignore: Constant id, so it's always TextChannel
    return channel.send(
        `\\🛠 ${
            error.name
        } caught!\n\`At ${timedate} at ${timehrs}\`\n\`\`\`xl\n${
            error.stack /*.split(process.cwd()).join('/home/container/').replaceAll('\\', '/')*/
        }\`\`\``
    );
}

// registered functions to use
const registers = { unhandledRejection, uncaughtException };

export default function processEvents(
    event: Record<string, any>,
    args: any,
    client: Client
) {
    //@ts-ignore: Event cannot be used as key, I dunno wh :(
    if (registers[event]) {
        //@ts-ignore
        return registers[event](args, client);
    } else {
        return consoleUtil.warn(
            `Function for process#event \`${event}\` not registered at ${__filename}`,
            '[BOT PROCESS]'
        );
    }
}
