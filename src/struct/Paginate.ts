import { MessageEmbed } from 'discord.js';

export default class Paginate {
    /**
     * Array of MessageEmbed instance to paginate
     */
    private _array: MessageEmbed[];
    /**
     * The current index of the pagnation
     */
    private _index: number;
    constructor(...array: MessageEmbed[]) {
        this._array = [...array].flat();
        this._index = 0;
        this._validate();
    }
    /**
     * Add more MessageEmbed to the array
     * @param item An array or a single MessageEmbed instance
     * @returns The array of the added MessageEmbeds
     */
    add(...item: MessageEmbed[]): MessageEmbed[] {
        this._array.push(...item.flat());
        this._validate();
        return [...item.flat()];
    }

    /**
     * Delete some elements from the array
     * @param index the index of the element to remove
     * @returns The array of the deleted MessageEmbed
     */
    delete(index: number): MessageEmbed | MessageEmbed[] {
        if (typeof index !== 'number') {
            return [];
        } else {
            if (index === this.currentIndex) {
                if (this.currentIndex > 0) {
                    this.previous();
                }
            } else if (this.currentIndex === this.tail) {
                this.previous();
            }
            return this._array.splice(index, 1);
        }
    }

    /**
     * Moves the index up to view the next element from the array
     * Circular - will revert to 0 if the index exceeds array length
     * @returns The element from the array
     */
    next(): MessageEmbed | undefined {
        if (!this._array.length) {
            return undefined;
        }
        if (this._index === this.tail) this._index = -1;
        this._index++;
        return this._array[this._index];
    }

    /**
     * Moves the index down to view the previous element from the array
     * Circular - will revert to the max index if the index is less than 0
     * @returns The element from the array
     */
    previous(): MessageEmbed | undefined {
        if (!this._array.length) {
            return undefined;
        }
        if (this._index === 0) this._index = this.tail as number + 1;
        this._index--;
        return this._array[this._index];
    }

    /**
     * The current embed using the current index
     */
    get currentPage(): MessageEmbed | undefined {
        return this._array[this._index];
    }

    /**
     * The first embed from the array
     */
    get firstPage(): MessageEmbed | undefined {
        return this._array[0];
    }

    /**
     * The last embed from the array
     * @readonly
     */
    get lastPage(): MessageEmbed | undefined {
        return this._array[this.tail as number];
    }

    /**
     * The current index
     */
    get currentIndex(): number | null {
        return this._index;
    }

    /**
     * The number of embed in the array
     */
    get size(): number {
        return this._array.length;
    }

    /**
     * The last index, or null if no element.
     */
    get tail(): number | null {
        return this._array.length > 0 ? this._array.length - 1 : null;
    }
    /**
     * Checks if there is a non message embed present in the array
     */
    private _validate(): void | null {
        for (const el of this._array) {
            if (!(el instanceof MessageEmbed))
                throw new Error(
                    'Paginate: Passed argument is not an instance of MessageEmbed!'
                );
        }

    }
}
