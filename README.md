## Find efficiently in k-dimensional data

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

### API

- `new Octree/new Quadtree(array<{[key]}>, <{key?: string = 'coords', transform?: function = x => x, depth?: number = 4}>)`
- `add(array<{[key]}>)`: Add an array of items
- `closest(value)`: Search for the closest item by `key` value
- `remove(value)`: Remove an item from the tree by `key` value

```js
import colorNames from 'color-names';
import { Octree } from 'ktree'; // colors are 3-dimensional, so use Octree

// simple hex-to-rgb (assuming no short formats, else see https://unpkg.com/color-tf/hexToRgb.js)
const hexToRgb = s => [s.slice(-6, -4), s.slice(-4, -2), s.slice(-2)].map(x => parseInt(x, 16));

const colors = Object.entries(colorNames).map(([hex, name]) => ({ name, hex }));

// Octree constructor needs an array of {[key], ...} objects, where key is configurable
// We'll use 'hex' here, and add a 'transform' property to map those 'hex' values to 3D coordinates
const tree = new Octree(colors, { key: 'hex', transform: hexToRgb });
console.log(tree.closest('5544df')); // { name: 'Majorelle Blue', hex: '#6050dc', d2: 273 }
tree.remove('#6050dc');
console.log(tree.closest('5544df')); // { name: 'Iris', hex: '#5a4fcf', d2: 402 }
```

[npm-image]: https://img.shields.io/npm/v/ktree.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ktree
[travis-image]: https://img.shields.io/travis/caub/ktree.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/ktree
[codecov-image]: https://img.shields.io/codecov/c/github/caub/ktree.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/ktree
