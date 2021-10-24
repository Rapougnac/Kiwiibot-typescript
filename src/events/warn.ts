import KiwiiClient from '../struct/Client';
import Event from '../struct/Event';

export default class WarnEvent extends Event {
    constructor(client: KiwiiClient) {
        super(client, {
            name: 'warn',
            once: false,
        });
    }
    public execute(info: string): void {
        console.warn(info);
    }
}
