import { APIMessageContentResolvable, Message, Presence } from 'discord.js';
import { I18n } from 'i18n';

declare global {
    interface Array<T> {
        /**
         * Remove a element of the array by it's name
         * Returns a copy of the array, but without the elements passed in the parameter
         * @param keys The keys to remove from the array
         */
        remove(...keys: string[]): string[];

        /**
         * Returns the indexes of an array that meet the condition specified in a callback function.
         * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
         */
        filterIndex<S extends T>(
            predicate: (value: S, index: number, array: S[]) => value is S,
            thisArg?: any
        ): number[];
    }

    interface Object {
        /**
         * Check if an object is empty or not. An object is considered empty if it doesn't have any enumerable properties.\
         * Note that this method is not suitable to use as a `filter` predicate.\
         * If you want to check if an object is empty, you should use the `Object.keys` method to get the object's keys, and then check that the array's length property. For example: `Object.keys(obj).length === 0`.\
         * This method is for purely aesthetic purposes. It is considered bad practice to extend native properties/method. And mongo db don't like it.
         */
        isEmpty(): boolean;
    }
}

declare namespace Intl {
    class ListFormat {
        public format: (items: [string?]) => string;
    }
}

declare module 'discord.js' {
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

    export interface User {
        /**
         * The presence of this user.
         */
        readonly presence?: Presence;
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
