import { ClientOptions, PermissionString, PresenceStatusData } from 'discord.js';

export interface Config {
    domain: string;
    port: number;
    usingCustomDomain: boolean;
    clientSecret: boolean;
    discord: {
        token: string;
        status: PresenceStatusData;
        defaultPerms: PermissionString[];
        dev: {
            include_cmd: string[];
            exclude_cmd: string[];
            active: boolean;
        };
    };
    emojis: {
        off: string;
        error: string;
        queue: string;
        music: string;
        success: string;
    };
    ytsearcher: {
        key: string;
    };
    genius_lyrics: {
        TOKEN: string;
    };
    amethyste: {
        client: string;
    };
    filters: string[];
    channels: {
        debug: string;
        logs: string;
    };
    clientMap: {
        web: string;
        mobile: string;
        desktop: string;
    };
    colors: {
        base: string;
        positive: string;
        neutral: string;
        negative: string;
    };
    database: {
        enable: boolean;
        URI: string;
        config: {
            useUnifiedTopology: boolean;
            useNewUrlParser: boolean;
            autoIndex: boolean;
            poolSize: number;
            connectTimeoutMS: number;
            family: number;
        };
    };
    verificationLVL: {
        NONE: string;
        LOW: string;
        MEDIUM: string;
        HIGH: string;
        VERY_HIGH: string;
    };
    chatbot: {
        id: string;
        key: string;
    };
}

export interface KiwiiClientOptions {
    prefix: string;
    config: Config;
    clientOptions: ClientOptions;
    disabledEvents?: string[];
    owners: string | string[];
}

export interface ProcessEventOptions {
    /**Logs the error on the console */
    log_on_console: boolean;
    /**No error sended both on the channel & the console */
    nologs: boolean;
    /**Logs the error on the console & the channel */
    logsonboth: boolean;
}
