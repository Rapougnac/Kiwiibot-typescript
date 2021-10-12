import KiwiiClient from './src/struct/Client';
import * as config from './config';

const client = new KiwiiClient({
    //@ts-ignore
    config: config,
    owners: '253554702858452992',
});

client.start();
client.login();