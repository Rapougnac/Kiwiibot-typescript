import { Structures, User, Client, AllowedImageFormat, ImageSize, ImageURLOptions } from 'discord.js';
import KiwiiClient from './Client';

class ExtendedUser extends User {
    /**
     * The hash of the user's banner
     */
    public banner: string | null;
    constructor(client: Client, data: object) {
        super(client, data);
        this.banner = null;
        (this.client as any).api
            .users((data as any).id)
            .get()
            .then((_data: any) => {
                if ('banner' in _data) {
                    /**
                     * The ID of the user's banner
                     * @type {?string}
                     */
                    this.banner = _data.banner;
                } else if (typeof this.banner !== 'string') {
                    this.banner = null;
                }
            });
    }

    /**
     * Get the banner of the user
     * @param userID The user id to pass in.
     * @param hash The hash of the banner
     * @param format The format of the image
     * @param size The size of the banner
     * @param dynamic If avaliable and if true, the format will be .gif
     * @param root The root url
     * @returns The url of the banner
     * @private
     */
    Banner(userID: string, hash: string, format: AllowedImageFormat = 'webp', size: ImageSize, dynamic: boolean = false): string {
        const root = 'https://cdn.discordapp.com';
        if (dynamic) format = hash.startsWith('a_') ? 'gif' : format;
        return (this.client as unknown as KiwiiClient).utils.makeImageUrl(
            `${root}/banners/${userID}/${hash}`,
            {
                format,
                size,
            }
        );
    }
    /**
     * Display the banner url of the user, if there's one
     * @returns The url of the banner
     */
    displayBannerURL({ format, size, dynamic }: ImageURLOptions & { dynamic?: boolean; } = {}): string | null {
        if (!this.banner) return null;
        return this.Banner(this.id, this.banner, format, size as ImageSize, dynamic);
    }
    /**
     * Check if the user has a banner
     */
    hasBanner(): boolean {
        if (this.banner) return true;
        else return false;
    }
}

Structures.extend('User', () => ExtendedUser);

export default ExtendedUser;
