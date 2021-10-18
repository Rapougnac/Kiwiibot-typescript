import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/Message';
import './src/struct/Guild';
import './src/struct/GuildMember';
import './src/struct/User';

const client = new KiwiiClient({
    config: config,
    owners: '253554702858452992',
    prefix: '!',
});

client.connect();
client.start();