import { ClientEvents } from 'discord.js';
import Event from '../Event';
export interface EventOptions {
    /**
     * If the event is triggered `<Event>.once();` instead of `<Event>.on();`
     */
    once?: boolean;
    /**
     * The emitter of the event
     */
    emitter?: Listener;
    name: ClientEvents;
}

export interface Listener {
    on: () => void;
    once: () => void;
}
export interface EventConstructor {
    new (): Event;
}