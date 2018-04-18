import assert from 'assert';
import colorNameList from 'color-name-list';
import colorNames from 'color-names';
import { add, closest, init, remove, parseHex, distHex } from './index';

assert.equal(parseHex('#bbb'), 'bbbbbb');
assert.equal(parseHex('aaa'), 'aaaaaa')
assert.equal(parseHex('e70566'), 'e70566')
assert.equal(parseHex('#e70566'), 'e70566');
assert.equal(parseHex('#88e70566'), 'e70566');


console.time('add');
add([{ name: 'Test', hex: '557' }, { name: 'Test_', hex: '656' }]);
console.timeEnd('add');

console.time('closest');
const col = closest('556');
console.timeEnd('closest');

assert.deepEqual(col, { name: 'Test', hex: '557', d: 17 });


// # color-names (148 colors)

const colors = Object.entries(colorNames).map(([hex, name]) => ({ hex, name }));

console.time('add2');
init(); // init(7) by default
add(colors);
console.timeEnd('add2');

console.time('closest2');
const col2 = closest('556');
console.timeEnd('closest2');

assert.deepEqual(col2, { hex: '#585562', name: 'Scarpa Flow', d: 5 });


// # color-name-list (17k colors)

console.time('add3');
init(7);
add(colorNameList);
console.timeEnd('add3');

console.time('closest3');
const col3 = closest('556');
console.timeEnd('closest3');

assert.deepEqual(col3, { name: 'Freefall', hex: '#565266', d: 3.1622776601683795 });

console.time('remove31');
remove('#565266');
console.timeEnd('remove31');

console.time('closest31');
const col31 = closest('556');
console.timeEnd('closest31');

assert.deepEqual(col31, { name: 'Inky Storm', hex: '#535266', d: 3.605551275463989 });

console.time('remove32');
remove('#535266');
console.timeEnd('remove32');

console.time('closest32');
const col32 = closest('556');
console.timeEnd('closest32');

assert.deepEqual(col32, {
  name: `Black Dragon's Caldron`,
  hex: '#545562',
  d: 4.123105625617661
});


/*
add: 2614.124ms
closest: 0.762ms
add2: 2233.753ms
closest2: 0.187ms
add3: 2620.856ms
closest3: 0.152ms
remove31: 0.646ms
closest31: 0.115ms
remove32: 0.427ms
closest32: 0.179ms
 */
