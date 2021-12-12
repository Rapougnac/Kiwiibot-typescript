import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/Guild';
import './src/struct/User';
import Intents from './src/struct/Intents';
import { error } from './src/util/console';

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
    database: {
        database: 'test',
        host: 'localhost',
        password: '',
        user: 'root',
    },
});

(async () => await client.connect())().catch(error);
client.start();
