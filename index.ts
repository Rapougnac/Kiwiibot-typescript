import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/Guild';
import Intents from './src/struct/Intents';

const client = new KiwiiClient({
    config: config,
    owners: '253554702858452992',
    prefix: 'm?',
    clientOptions: {
        intents: Intents.ALL,
        allowedMentions: {
            repliedUser: false,
        },
        partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'],
    },
});

(async () => await client.connect())();
client.start();
