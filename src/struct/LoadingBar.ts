import { Message } from 'discord.js';

export default class LoadingBar {
    /**
     * Start the loading bar event
     * @param length The length of the loading bar
     * @param time The time to wait in milliseconds before each refresh of the bar
     * @param allowMessage If it should send with message using discord.js
     * @param message The Message object
     * @param start The start of the progress bar
     * @param end The end of the progress bar
     * @param empty The empty string of the progress bar
     * @param full] The full string of the progress bar
     * @param deleteMessage If it should delete the bar after completed
     * @param timeoutMessage If it should delete the message after a time
     * @example
     * const loader = new LoadingBar();
     * loader.start(25, 500); // This will change the length of the bar & the time before update
     */
    public async start(
        length: number = 20,
        time: number = 250,
        allowMessage: boolean = false,
        message: Message,
        start: string = '[',
        end: string = ']',
        empty: string = '\u2591',
        full: string = '\u2588',
        deleteMessage: boolean = false,
        timeoutMessage: number = 0
    ): Promise<void> {
        if (!allowMessage && !message) {
            for (let i = 0; i <= length; i++) {
                const Full = full.repeat(i);
                const left = length - i;
                const Empty = empty.repeat(left);
                const nbr = length * (100 / length);
                const percentage = (i * nbr) / length;
                console.log(
                    `\r${start}${Full}${Empty}${end} ${
                        Number.isInteger(percentage)
                            ? percentage
                            : percentage.toFixed(2)
                    }%`
                );
                await LoadingBar.wait(time);
            }
        } else {
            for (let i = 0; i <= length; i++) {
                const Full = full.repeat(i);
                const left = length - i;
                const Empty = empty.repeat(left);
                // Get the percentage with the constant nbr
                const percentage = (i * 100) / length;
                // If this is the 1st time, send the message
                if (i === 0) {
                    // Reassign message
                    message = await message.channel.send(
                        `\r${start}${Full}${Empty}${end} ${
                            Number.isInteger(percentage)
                                ? percentage
                                : percentage.toFixed(2)
                        }%`
                    );
                } else {
                    // Edit message
                    message.edit(
                        `\r${start}${Full}${Empty}${end} ${
                            Number.isInteger(percentage)
                                ? percentage
                                : percentage.toFixed(2)
                        }%`
                    );
                }
                // If this is the end of the progress, and deleteMessage has been enabled, delete the message
                if (i === length && deleteMessage && allowMessage && message) {
                    setTimeout(() => {
                        message.delete();
                    }, timeoutMessage);
                }
                await LoadingBar.wait(time);
            }
        }
    }

    /**
     * Method to wait
     * @param milliseconds The time in ms to wait
     */
    static wait(milliseconds: number = 250): Promise<any> {
        return new Promise((res) => setTimeout(res, milliseconds));
    }
}
