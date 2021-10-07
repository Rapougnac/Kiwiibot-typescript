function createEnum(keys: Record<string, any>) {
    const obj: obj = {};
    for (const [index, key] of keys.entries()) {
        if (key === null) continue;
        obj[key] = index;
        obj[index] = key;
    }
    return obj;
}
/**
 * The type of an {@link Interaction} object:
 * * PING
 * * APPLICATION_COMMAND
 * * MESSAGE_COMPONENT
 * @typedef {string} InteractionType
 */
export const InteractionTypes = createEnum([
    null,
    'PING',
    'APPLICATION_COMMAND',
    'MESSAGE_COMPONENT',
]);
/**
 * The type of a message component
 * * ACTION_ROW
 * * BUTTON
 * * SELECT_MENU
 * @typedef {string} MessageComponentType
 */
export const MessageComponentTypes = createEnum([
    null,
    'ACTION_ROW',
    'BUTTON',
    'SELECT_MENU',
]);

/**
 * The type of an {@link ApplicationCommandOption} object:
 * * SUB_COMMAND
 * * SUB_COMMAND_GROUP
 * * STRING
 * * INTEGER
 * * BOOLEAN
 * * USER
 * * CHANNEL
 * * ROLE
 * * MENTIONABLE
 * @typedef {string} ApplicationCommandOptionType
 */
export const ApplicationCommandOptionTypes = createEnum([
    null,
    'SUB_COMMAND',
    'SUB_COMMAND_GROUP',
    'STRING',
    'INTEGER',
    'BOOLEAN',
    'USER',
    'CHANNEL',
    'ROLE',
    'MENTIONABLE',
]);
/**@typedef {name: string, value: string|number} ApplicationCommandOptionChoice */
/**
 * An option for an application command or subcommand.
 * @typedef {Object} ApplicationCommandOption
 * @property {ApplicationCommandOptionType} type The type of the option
 * @property {string} name The name of the option
 * @property {string} description The description of the option
 * @property {boolean} [required] Whether the option is required
 * @property {ApplicationCommandOptionChoice[]} [choices] The choices of the option for the user to pick from
 * @property {ApplicationCommandOption[]} [options] Additional options if this option is a subcommand (group)
 */
type obj = {
    [key: string]: string;
};
