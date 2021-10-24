declare module 'gifu' {
    type Gifs =
        | 'bite'
        | 'blush'
        | 'bored'
        | 'bully'
        | 'chase'
        | 'cheer'
        | 'cringe'
        | 'cry'
        | 'cuddle'
        | 'dance'
        | 'facepalm'
        | 'glomp'
        | 'hold'
        | 'happy'
        | 'hate'
        | 'highfive';
    /**
     * This function will pick a random gif, specified in the {@link gifu} parameter
     * @param option The gif to search for
     * @returns The link of the random gif
     * @example
     * const { gifu } = require('gifu');
     * // Or import { gifu } from 'gifu'; in ES6/TypeScript environment
     * 
     * const result = gifu('dance'); // -> https://media1.tenor.com/images/81c0b8d3c0617d2902319b7f67e6ce01/tenor.gif
     */
    export function gifu(option: Gifs): string;
}
