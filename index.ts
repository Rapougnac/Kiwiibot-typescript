import KiwiiClient from './src/struct/Client';
import * as config from './config';
import './src/struct/User';
import './src/struct/CommandInteraction';
import Intents from './src/struct/Intents';
import { error } from './src/util/console';

const client = new KiwiiClient({
  config: config,
  owners: '253554702858452992',
  prefix: 'm?',
  typescript: true,
  clientOptions: {
    intents: Intents.ALL,
    allowedMentions: {
      repliedUser: false,
    },
    partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER'],
  },
  database: config.mysql,
});

(async () => await client.connect())().catch(error);
client.start();
