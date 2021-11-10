import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/Message';
import './src/struct/Guild';
import './src/struct/GuildMember';
import './src/struct/User';
import { WSEventType as WSEventTypeOld } from 'discord.js';
import Interaction from './src/struct/Interactions/Interaction';
import CommandInteraction from './src/struct/Interactions/CommandInteraction';

type WSEventType = 'INTERACTION_CREATE' | WSEventTypeOld;

const client = new KiwiiClient({
    config: config,
    owners: '253554702858452992',
    prefix: 'm?',
});

(async () => await client.connect())();
client.start();

client.ws.on('INTERACTION_CREATE' as WSEventType as any, (int: any) => {
    let interaction = new Interaction(client, int);
    if (interaction.isCommand()) {
        const interaction = new CommandInteraction(client, int);
        const { commandName: name, options } = interaction;
        const { args } = options;
        if (!client.slashs.has(name)) return;
        try {
            client.slashs.get(name)?.execute(interaction, client, args);
        } catch (e: any) {
            const { message, stack } = e;
            console.error(`Error from command ${name}: ${message}\n${stack}`);
            interaction.send(
                'Sorry there was an error executing that command!',
                {
                    ephemeral: true,
                }
            );
        }
    }
});
