declare module 'amethyste-api' {
    export default class AmeClient {
        /**
         * @param token Provider: api.amethyste.moe
         * @param options The options to assign to the client
         */
        public constructor(token: string, options?: AmeClientOptions);

        private readonly token: string;
        public options: AmeClientOptions;
        /**
         * Return an image from the endpoint and the data sent.
         * @param endpoint Name of the endpoint
         * @param data Object to send data (url, blur, etc..)
         */
        public generate(endpoint: BaseEndpoints, data: dataOptions): Promise<Buffer>;
        public generate(endpoint: EndpointsWithAvatarProp, data: dataOptionsAvatar): Promise<Buffer>;
        public generate(endpoint: 'badge', data: dataOptionsBadge): Promise<Buffer>;
        public generate(endpoint: 'facebook', data: dataOptionsText): Promise<Buffer>;
        public generate(endpoint: 'discordhouse', data: dataOptionsHouse): Promise<Buffer>;
        public generate(endpoint: 'twitter', data: dataOptionsTwitter): Promise<Buffer>;
        public generate(endpoint: 'triggered', data: dataOptionsTriggered): Promise<Buffer>;
        public generate(endpoint: 'trinity', data: dataOptionsTrinity): Promise<Buffer>;
        public generate(endpoint: 'symmetry', data: dataOptionsSymmetry): Promise<Buffer>;
        public generate(endpoint: 'vs', data: dataOptionsVS): Promise<Buffer>;
        public generate(endpoint: 'invert', data: dataOptionsInvert): Promise<Buffer>;
        public generate(endpoint: 'pixelize', data: dataOptionsPixelize): Promise<Buffer>;

        public image(endpoint: string): Promise<imageResponse>;

        public getEndpointsGenerate(onlyFree?: boolean): Promise<object>;

        public getEndpointsImage(onlyFree?: boolean): Promise<object>;
    }

    export type AmeClientOptions = {
        [x: string]: string;
        baseURL?: string;
    };

    export type imageResponse = {
        status: number;
        url: string;
    };

    export interface dataOptions {
        /**
         * Url of your image
         */
        url: string;
    }

    export interface dataOptionsBadge extends dataOptions {
        /**
         * Text of your username (max 13 lenght)
         */
        text: string;
        /**
         * Number of server (max:  999999)
         */
        numberserver: number;
        /**
         * Number of users (max: 99999)
         */
        numberuser: number;
    }

    export interface dataOptionsText extends dataOptions {
        /**
         * Text of your post
         */
        text: string;
    }

    export interface dataOptionsHouse extends dataOptions {
        /**
         * Name of house
         */
        house: Houses;
    }

    export interface dataOptionsAvatar extends dataOptions {
        /**
         * Url of your image
         */
        avatar: string;
    }

    export interface dataOptionsInvert extends dataOptions {
        /**
         * Invert your image with greyple
         * @default false
         */
        invert: boolean;
    }

    export interface dataOptionsPixelize extends dataOptions {
        /**
         * Pixelize your image
         * @default 5
         */
        pixelize: AllowedNumbers;
    }

    export interface dataOptionsSymmetry extends dataOptions {
        /**
         * Orientation of your image:
         */
        orientation: AllowedOrientationsFormat;
    }

    export interface dataOptionsTrinity extends dataOptions {
        /**
         * Select type of image
         */
        type: AllowedTypesOfTrinity;
    }

    export interface dataOptionsTwitter extends dataOptions {
        /**
         * Url of your image
         */
        avatar1: string;
        /**
         * Url of your image
         */
        avatar2: string;
        /**
         * Url of your image
         */
        avatar3: string;
        /**
         * Custom text
         * @warn The max length is 360
         */
        text: string;
    }

    export interface dataOptionsTriggered extends dataOptions {
        /**
         * Blur your image
         * @default false
         */
        blur?: boolean;
        /**
         * Greyscale your image
         * @default false
         */
        greyscale?: boolean;
        /**
         * @default false
         */
        horizontal?: boolean;
        /**
         * Invert your image
         * @default false
         */
        invert?: boolean;
        /**
         * Sepia your image
         * @default false
         */
        sepia?: boolean;
        /**
         * @default false
         */
        vertical?: boolean;
    }

    export interface dataOptionsVS extends dataOptions, dataOptionsAvatar {
        /**
         * For type, you can choose
         * 
         * `1) orange and blue`
         * 
         * `2) red and blue`
         * 
         * `3) red gradient and blue`
         * 
         * Select type of color image
         * @default 1
         */
        type: AllowedTypeVS;
    }

    export type BaseEndpoints =
        | '3000years'
        | 'approuved'
        | 'beautiful'
        | 'brazzers'
        | 'burn'
        | 'challenger'
        | 'circle'
        | 'contrast'
        | 'crush'
        | 'ddungeon'
        | 'deepfry'
        | 'dictator'
        | 'distort'
        | 'dither565'
        | 'emboss'
        | 'fire'
        | 'frame'
        | 'gay'
        | 'glitch'
        | 'greyscale'
        | 'instagram'
        | 'invert'
        | 'jail'
        | 'lookwhatkarenhave'
        | 'magik'
        | 'missionpassed'
        | 'moustache'
        | 'ps4'
        | 'posterize'
        | 'rejected'
        | 'rip'
        | 'scary'
        | 'sepia'
        | 'sniper'
        | 'thanos'
        | 'tobecontinued'
        | 'subzero'
        | 'unsharpen'
        | 'utatoo'
        | 'wanted'
        | 'wasted';
    export type AllowedOrientationsFormat =
        | 'letf-right'
        | 'right-left'
        | 'top-bottom'
        | 'bottom-top'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';
    export type AllowedTypesOfTrinity = 'basic' | 'remastered';
    export type EndpointsWithAvatarProp = 'afusion' | 'batslap' | 'whowouldwin';
    export type Houses = 'brilliance' | 'bravery' | 'balance';
    export type AllowedTypeVS = 1 | 2 | 3;
    export type AllowedNumbers =
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | 18
        | 19
        | 20
        | 21
        | 22
        | 23
        | 24
        | 25
        | 26
        | 27
        | 28
        | 29
        | 30
        | 31
        | 32
        | 33
        | 34
        | 35
        | 36
        | 37
        | 38
        | 39
        | 40
        | 41
        | 42
        | 43
        | 44
        | 45
        | 46
        | 47
        | 48
        | 49
        | 50;
}
