import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/Message';
import './src/struct/Guild';
import './src/struct/GuildMember';
import './src/struct/User';

const client = new KiwiiClient({
    //@ts-ignore
    config: config,
    owners: '253554702858452992',
    prefix: '!',
});

client.login();
client.start();