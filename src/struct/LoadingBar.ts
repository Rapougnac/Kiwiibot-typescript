/* eslint-disable no-await-in-loop */
import { StartOptions } from './interfaces/LoadingBar';

export default class LoadingBar {
    /**
     * Start the loading bar event
     * @example
     * const loader = new LoadingBar();
     * loader.start({ length: 25, time: 500 }); // This will change the length of the bar & the time before update
     */
    public async start({
        length = 20,
        time = 250,
        allowMessage = false,
        message,
        start = '[',
        end = ']',
        empty = '\u2591',
        full = '\u2588',
        deleteMessage = false,
        timeoutMessage = 0,
    }: StartOptions = {}): Promise<void> {
        if (!allowMessage && !message) {
            for (let i = 0; i <= length; i++) {
                const Full = full.repeat(i);
                const left = length - i;
                const Empty = empty.repeat(left);
                const nbr = length * (100 / length);
                const percentage = (i * nbr) / length;
                // eslint-disable-next-line no-console
                console.log(
                    `\r${start}${Full}${Empty}${end} ${
                        Number.isInteger(percentage)
                            ? percentage
                            : percentage.toFixed(2)
                    }%`
                );
                await LoadingBar.wait(time);
            }
        } else if (message) {
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
                        message?.delete();
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
    static wait(milliseconds = 250): Promise<unknown> {
        return new Promise((res) => setTimeout(res, milliseconds));
    }
}
