Array.prototype.remove = function (...keys: string[]): string[] {
  let what, ax;
  while (keys.length && this.length) {
    what = keys[--keys.length];
    ax = this.indexOf(what);
    while (ax !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

Array.prototype.filterIndex = function <T>(
  predicate: (value: T, _index: number, _array: T[]) => value is T
): number[] {
  const results: number[] = [];
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i], i, this)) {
      results.push(i);
    }
  }
  return results;
};

// MongoDB don't like this :(
// Object.prototype.isEmpty = function (): boolean {
//     return (
//         this &&
//         Object.keys(this).length === 0 &&
//         Object.getPrototypeOf(this) === Object.prototype
//     );
// };
