import type KiwiiClient from '../struct/Client';
import Event from '../struct/Event';

export default class WarnEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'warn',
            once: false,
        });
    }
    public execute(info: string): void {
        // eslint-disable-next-line no-console
        console.warn(info);
    }
}
