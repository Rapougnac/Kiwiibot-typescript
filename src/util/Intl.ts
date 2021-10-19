declare namespace Intl {
    class ListFormat {
        constructor(s: string);
        public format: (items: string[]) => string;
    }
}