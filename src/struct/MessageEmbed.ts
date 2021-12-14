import { MessageEmbed } from 'discord.js';

/**
 * An extended version of the `MessageEmbed`
 * @extends MessageEmbed
 */
export default class ExtendedMessageEmbed extends MessageEmbed {
    /**
     * @param inline The inline of the embed, leave it empty will return `false`
     */
    addBlankField(inline = false): this {
        // Handling errors
        if (typeof inline !== 'boolean')
            throw new TypeError('The inline cannot be other than a boolean');
        return super.addField('\u200b', '\u200b', inline);
    }
}
