const { group, test, beforeStart, afterAll, expect } = require('corde');
const { default: Client } = require('../dist/src/struct/Client');
const config = require('../dist/config');

const client = new Client({
    config: config,
    owners: '253554702858452992',
    prefix: 'm?',
});
console.log(client);

beforeStart(async () => {
    await client.connect();
    client.start();
});

group('main commands', () => {
    test('ping command should return API latency + ping', () => {
        expect('no-u').toReturn('no-u');
    });
});

afterAll(() => client.destroy());
