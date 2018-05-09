import assert from 'assert';
import colorNameList from 'color-name-list';
import colorNames from 'color-names';
import {add, closest, init, remove, parseHex, distHex} from './index';

assert.equal(parseHex('#bbb'), 'bbbbbb');
assert.equal(parseHex('aaa'), 'aaaaaa')
assert.equal(parseHex('e70566'), 'e70566')
assert.equal(parseHex('#e70566'), 'e70566');
assert.equal(parseHex('#e7056688'), 'e70566');

console.log('## basic');

console.time('add');
add([{name: 'Test', hex: '557'}, {name: 'Test_', hex: '656'}]);
console.timeEnd('add');

console.time('closest');
const col = closest('556');
console.timeEnd('closest');

assert.deepEqual(col, {name: 'Test', hex: '557', d: 17});


console.log('\n## color-names (148 colors)');

const colors = Object.entries(colorNames).map(([hex, name]) => ({hex, name}));

console.time('add');
init(); // init(7) by default
add(colors);
console.timeEnd('add');

console.time('closest');
const col2 = closest('556');
console.timeEnd('closest');

assert.deepEqual(col2, {hex: '#585562', name: 'Scarpa Flow', d: 5});


console.log('\n## color-name-list (17k colors)');

console.time('add');
init(7);
add(colorNameList);
console.timeEnd('add');

console.time('closest');
const col3 = closest('556');
console.timeEnd('closest');

assert.deepEqual(col3, {name: 'Freefall', hex: '#565266', d: 3.1622776601683795});

console.time('remove');
remove('#565266');
console.timeEnd('remove');

console.time('closest');
const col31 = closest('556');
console.timeEnd('closest');

assert.deepEqual(col31, {name: 'Inky Storm', hex: '#535266', d: 3.605551275463989});

console.time('remove');
remove('#535266');
console.timeEnd('remove');

console.time('closest');
const col32 = closest('556');
console.timeEnd('closest');

assert.deepEqual(col32, {
  name: `Black Dragon's Caldron`,
  hex: '#545562',
  d: 4.123105625617661
});
