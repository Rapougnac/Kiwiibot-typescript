Array.prototype.remove = function (...keys: string[]): string[] {
    let what,
        ax;
    while (keys.length && this.length) {
        what = keys[--keys.length];
        ax = this.indexOf(what);
        while (ax !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}
