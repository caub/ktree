## Find efficiently the closest hex color

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

### API

- `add(colors /*array of {hex, name}*/)`: add an array of colors (`add` calls `init` if it was not initialized yet)
- `closest(hex)`: Search for the closest color
- `init(depth: Int = 7)`: Init the tree at a given depth (default 7), accepted range: [0, 7]
- `remove(hex)`: Remove a color object by its hex property

```js
import colorNames from 'color-names';
import { add, closest } from 'color-octree';

// we expect an array of {hex, name}
const colors = Object.entries(colorNames).map(([hex, name]) => ({ hex, name }));

add(colors);
console.log(closest('5544df'));
```

[live example](https://repl.it/@caub/closest-color)


### Notice

It uses `String.prototype.padStart`, it exists on node 8.11 and recent browsers, but you might still want to polyfill it (see polyfill.io or es-shims)

[npm-image]: https://img.shields.io/npm/v/color-octree.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/color-octree
[travis-image]: https://img.shields.io/travis/caub/color-octree.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/color-octree
