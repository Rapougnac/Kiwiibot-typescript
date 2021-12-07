/* eslint-disable camelcase */
import type { Config } from './src/struct/interfaces/Client';

export const domain = 'DOMAIN_HERE';
export const port = 0; // PORT_HERE
export const usingCustomDomain = false;
export const clientSecret = 'CLIENT_SECRET_HERE';
export const discord: Config['discord'] = {
    token: 'TOKEN_HERE',
    status: 'idle',
    dev: {
        include_cmd: [],
        exclude_cmd: [],
        active: false, //Default is false, you can put it to true to exclude or include commands
        debug: false, // Default is false, you can put it to true to enable debug mode (Don't use it in v13)
    },
    defaultPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
};
export const emojis = {
    off: '❌',
    error: '⚠️',
    queue: '📊',
    music: '🎵',
    success: '✅',
};
export const ytsearcher = {
    key: 'YT_SEARCH_KEY_HERE', // Optionnal
};
export const amethyste = {
    client: 'AMETHYSTE_KEY_HERE', // (optional, but mostly of images manipulation won't work)(https://api.amethyste.moe/) get one here, sign up and copy and paste your token
};
export const filters = [
    '8D',
    'gate',
    'haas',
    'phaser',
    'treble',
    'tremolo',
    'vibrato',
    'reverse',
    'karaoke',
    'flanger',
    'mcompand',
    'pulsator',
    'subboost',
    'bassboost',
    'vaporwave',
    'nightcore',
    'normalizer',
    'surrounding',
];
export const channels = {
    debug: '838362111545442354',
    logs: '806129974011887706',
};
export const clientMap = {
    web: '🌐',
    mobile: '📱',
    desktop: '💻',
};
export const colors = {
    base: '7289da',
    positive: '3498db',
    neutral: 'e67e22',
    negative: 'e91e63',
};
export const database = {
    enable: true,
    URI: 'MONGO_URI_HERE',
    config: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
    },
};
export const verificationLVL = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻',
};

export const MAL = {
    // Optional
    username: 'MAL_USERNAME_HERE',
    password: 'MAL_PASSWORD_HERE',
};

export const kiwii = {
    // Optional
    apiKey: '',
};

export const genius_lyrics = {
    // Optional
    TOKEN: 'GENIUS_LYRICS_KEY_HERE',
};

export const chatbot = {
    // Optional
    id: '',
    key: '',
};
