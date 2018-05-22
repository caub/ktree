## Find efficiently in k-dimensional data

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

### API

- `new Octree/new Quadtree(array<{name, [key]}>, <{key?: string = 'coords', transform?: function = x => x, depth?: number = 4}>)`
- `add(array<{name, [key]}>)`: Add an array of items
- `closest(coords)`: Search for the closest color
- `remove(coords)`: Remove a color object from the tree

```js
import colorNames from 'color-names';
import { Octree } from 'ktree';

// simple hex-to-rgb (assuming no short formats, else see https://unpkg.com/color-tf/hexToRgb.js)
const hexToRgb = s => [s.slice(-6, -4), s.slice(-4, -2), s.slice(-2)].map(x => parseInt(x, 16));

// we expect an array of {[key], ...} objects, where key is configurable
const colors = Object.entries(colorNames).map(([hex, name]) => ({ name, hex }));

const tree = new Octree(colors, { key: 'hex', transform: hexToRgb });
console.log(tree.closest('5544df'));
```

[npm-image]: https://img.shields.io/npm/v/ktree.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ktree
[travis-image]: https://img.shields.io/travis/caub/ktree.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/ktree
[codecov-image]: https://img.shields.io/codecov/c/github/caub/ktree.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/ktree