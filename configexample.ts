/* eslint-disable camelcase */
export const domain = 'DOMAIN_HERE';
export const port = 'PORT_HERE';
export const usingCustomDomain = false;
export const clientSecret = 'CLIENT_SECRET_HERE';
export const discord = {
    token: 'TOKEN_HERE',
    status: 'idle',
    dev: {
        include_cmd: [],
        exclude_cmd: [],
        active: false, //Default is false, you can put it to true to exclude or include commands
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
