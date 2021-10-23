declare module '@xelzs/mdn-browser-compat-api' {
    import { Browsers } from '@mdn/browser-compat-data/types';
    export type Folders =
        | 'api'
        | 'browsers'
        | 'html'
        | 'http'
        | 'javascript'
        | 'mathml'
        | 'svg'
        | 'webdriver'
        | 'webextensions';
    /**
     * Find the query in the docs
     * @param query The query to search for
     * @param folder The folder to search in.
     */
    export function find(query: string, folder?: Folders): string[];
    /**
     * Get a list of features from mdn with the formatted paths.
     * @param folder The folder to get the features
     */
    export function getFeatures(folder?: Folders): string[];
    /**
     * Get the list of folders inside [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data).
     */
    export function getFolders(): string[];
    /**
     * Get the list of browsers. You check the schema at [@mdn-compat-data-schema.md](https://github.com/mdn/browser-compat-data/blob/main/schemas/compat-data-schema.md)
     */
    export function getBrowsers(): Browsers;
    /**
     * Get a list of object with corresponding features.
     * You check the schema at [@mdn-compat-data-schema.md](https://github.com/mdn/browser-compat-data/blob/main/schemas/compat-data-schema.md)
     * @param query The query to get
     */
    export function get(query: string): string[];
    /**
     * Update data files. (By default, generated during installation).
     */
    export function updateData(): void;
}
