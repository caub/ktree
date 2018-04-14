import assert from 'assert';
import colorNameList from 'color-name-list';
import colorNames from 'color-names';
import { add, closest, init, parseHex, distHex } from './index';

assert.equal(parseHex('#bbb'), 'bbbbbb');
assert.equal(parseHex('aaa'), 'aaaaaa')
assert.equal(parseHex('e70566'), 'e70566')
assert.equal(parseHex('#e70566'), 'e70566');
assert.equal(parseHex('#88e70566'), 'e70566');


console.time('add');
add([{name: 'Test', hex: '557'}, {name: 'Test_', hex: '656'}], {reset: true});
console.timeEnd('add');

console.time('closest');
const col = closest('556');
console.timeEnd('closest');

assert.deepEqual(col, { name: 'Test', hex: '557', d: 17 });

const colors = Object.entries(colorNames).map(([hex, name]) => ({hex, name}));

console.time('add2');
add(colors, {reset: true});
console.timeEnd('add2');

console.time('closest2');
const col2 = closest('556');
console.timeEnd('closest2');

assert.deepEqual(col2, { hex: '#585562', name: 'Scarpa Flow', d: 5 });

console.time('add3');
add(colorNameList, {depth: 6, reset: true});
console.timeEnd('add3');

console.time('closest3');
const col3 = closest('556');
console.timeEnd('closest3');

assert.deepEqual(col3, { name: 'Freefall', hex: '#565266', d: 3.1622776601683795 });
