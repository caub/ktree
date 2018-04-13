## Find efficiently the closest hex color

```js
import colorNames  from 'color-names';
import ColorTree from 'color-octree';

// we expect an array of {hex, name}
const entries = Object.entries(colorNames).map(([hex, name]) => ({hex, name}));

const tree = new ColorTree();
tree.addAll(entries);
console.log(tree.closest('5544df'))
```
