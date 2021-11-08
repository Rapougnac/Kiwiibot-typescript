import { APIMessageContentResolvable, Message } from 'discord.js';
import { I18n } from 'i18n';

declare global {
    interface Array {
        /**
         * Remove a element of the array by it's name
         * Returns a copy of the array, but without the elements passed in the parameter
         * @param keys The keys to remove from the array
         */
        remove(...keys: string[]): string[];
    }
}

declare namespace Intl {
    class ListFormat {
        public format: (items: [string?]) => string;
    }
}

declare module 'discord.js' {
    export interface MessageMentionOptions {
        repliedUser?: boolean;
    }
    export interface Guild {
        /**
         * The i18n object notation
         */
        readonly i18n: I18n;
        /**
         * The prefix of the guild, if there's one.
         */
        prefix: string;
    }
}

declare module 'mongoose' {
    interface Connection {
        /**
         * Send `true` if the connection is etablished successfully
         */
        _hasOpened: boolean;
    }
}
