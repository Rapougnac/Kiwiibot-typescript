import { Client, Intents, Collection } from 'discord.js';
import glob from 'glob';
//@ts-ignore
Intents.ALL = Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0);
const client: Client = new Client({
    //@ts-ignore
    intents: Intents.ALL,
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user!.tag}`);
});

client.on('messageCreate', (message) => {});
