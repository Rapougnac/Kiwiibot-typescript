import { Message, MessageReaction, User } from 'discord.js';
/**
 * Confirm a message with reaction
 * @param message The message
 * @param validReactions The reactions to react to the message
 * @param time The time to wait to collect the reactions, default is set to `60000`
 */
const confirmation = async (
    message: Message,
    author: User,
    validReactions: string[],
    time = 60000
): Promise<string | void | null> => {
    if (!message) throw new ReferenceError('The message is not defined!');
    if (!validReactions || validReactions.length !== 2)
        throw new ReferenceError('Invalid from body [validReactions]');
    if (typeof time !== 'number')
        throw new SyntaxError('Type of time must be a number.');
    if (!message.guild?.available && !message.guild)
        throw new ReferenceError('The message is not in a guild.');

    if (!message.guild.me?.permissions.has('MANAGE_MESSAGES'))
        // eslint-disable-next-line no-console
        return console.log(
            'Client must me have the "MANAGE_MESSAGES" permission'
        );

    // eslint-disable-next-line no-await-in-loop
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction: MessageReaction, user: User) =>
        validReactions.includes(reaction.emoji.name ?? '') &&
        user.id === author.id;
    return message
        .awaitReactions({ filter, max: 1, time })
        .then(
            (collected) => collected.first() && collected.first()?.emoji.name
        );
};

export { confirmation };
