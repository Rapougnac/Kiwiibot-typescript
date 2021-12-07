/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
    class ListFormat {
        constructor(s: string);
        public format: (items: string[]) => string;
    }
}