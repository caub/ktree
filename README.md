## Find efficiently the closest hex color

```js
import colorNames from 'color-names';
import { add, closest } from 'color-octree';

// we expect an array of {hex, name}
const colors = Object.entries(colorNames).map(([hex, name]) => ({ hex, name }));

add(colors);
console.log(closest('5544df'));
```

[live example](https://repl.it/@caub/closest-color)
