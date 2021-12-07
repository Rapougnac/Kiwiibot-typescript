import exportHtml from './exportHtml';
import { ExportHtmlOptions } from './interfaces/exportHtml';
import {
    Message,
    MessageAttachment,
    TextChannel,
    Collection,
} from 'discord.js';

/**
 * Create a transcript, but with your own messages provided
 * @param messages The messages to transcript, must be a {@link Collection Collection<string, Message>} or {@link Message Message[]}
 * @param channel The channel, used for ticket name, guild icon, and guild name
 * @param options The options to use
 */
export function generateFromMessages(
    messages: Message[],
    channel: TextChannel,
    options: ExportHtmlOptions = { returnBuffer: false }
): Buffer | MessageAttachment {
    if (!options.returnBuffer) options.returnBuffer = false;
    if (!options.fileName) options.fileName = 'transcript.html';

    if (!Array.isArray(messages))
        throw new TypeError('messages must be an array');
    if (!(messages[0] instanceof Message))
        throw new TypeError('messages must be an array of Message objects');

    return exportHtml(messages, channel, options);
}

export async function createTranscript(
    channel: TextChannel,
    options: ExportHtmlOptions & { limit?: number } = { returnBuffer: false }
): Promise<Buffer | MessageAttachment> {
    if (!options.returnBuffer) options.returnBuffer = false;
    if (!options.fileName) options.fileName = 'transcript.html';
    if (!options.limit) options.limit = -1;

    if (!channel.isText()) {
        throw new Error('Provided channel must be a text channel.');
    }

    const sumMessages = [];
    let lastId;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const messages: Collection<string, Message> =
            await channel.messages.fetch({ limit: 100, before: lastId });
        sumMessages.push(...messages.values());
        lastId = messages.last()?.id;

        if (
            messages.size != 100 ||
            (options.limit > 0 && sumMessages.length >= options.limit)
        ) {
            break;
        }
    }

    return exportHtml(sumMessages, channel, options);
}
