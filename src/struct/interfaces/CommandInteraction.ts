import Interaction from '../Interactions/Interaction';
import CommandInteraction from '../Interactions/CommandInteraction';

/**
 * Options of the {@link CommandInteraction.send send} method in CommandInteraction
 */
export interface SendOptions {
    /**
     * If the interaction should be ephemeral
     */
    ephemeral?: boolean;
    /**
     * Add a response to the message when it's an object
     */
    response?: string | undefined;
}

/**
 * Options for deferring the reply to an {@link Interaction}. 
 */
export interface InteractionDeferOptions {
    /**
     * Whether the reply should be ephemeral
     */
    ephemeral?: boolean;
    /**
     * Whether to fetch the reply
     */
    fetchReply?: boolean;
}

/**
 * The edit options of {@link CommandInteraction.edit edit}
 */
export interface EditOptions {
    /**
     * The response if there's embeds or attachments, similar to {@link SendOptions.response}
     */
    response?: string;
}