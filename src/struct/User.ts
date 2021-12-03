import { User, Presence } from 'discord.js';

Object.defineProperty(User.prototype, 'presence', {
    get: function () {
        for (const guild of this.client.guilds.cache.values()) {
            if (guild.presences.cache.has(this.id)) {
                return guild.presences.cache.get(this.id);
            }
        }
        // @ts-ignore
        return new Presence(this.client, {
            user: {
                id: this.id,
            },
        });
    },
});
