import { User, Presence } from 'discord.js';

Object.defineProperty(User.prototype, 'presence', {
    get: function () {
        for (const guild of this.client.guilds.cache.values()) {
            if (guild.presences.cache.has(this.id)) {
                return guild.presences.cache.get(this.id);
            }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Presence is protected.
        return new Presence(this.client, {
            user: {
                id: this.id,
            },
        });
    },
});
