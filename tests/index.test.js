/* eslint-disable @typescript-eslint/no-var-requires */

const { group, test, beforeStart, afterAll, expect } = require('corde');
const { default: Client } = require('../dist/src/struct/Client');
const config = require('../dist/config');
const { default: Intents } = require('../dist/src/struct/Intents');

const client = new Client({
    config: config,
    owners: '253554702858452992',
    prefix: 'm?',
    clientOptions: {
        intents: Intents.ALL,
    },
});

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
