import assert from 'assert';
import hexToRgb from 'color-tf/hexToRgb';
import colorNameList from 'color-name-list';
import colorNames from 'color-names';
import { Octree } from '../index';

console.log('## basic');

console.time('add');
const t1 = new Octree(
	[{ name: 'Test', coords: hexToRgb('557') }, { name: 'Test_', coords: hexToRgb('656') }]
);
console.timeEnd('add');

assert.equal(JSON.stringify(t1, null, '\t'), `{
	"items": "",
	"cs": {
		"000": {
			"items": "85,85,119, 102,85,102",
			"cs": {
				"111": {
					"items": "85,85,119, 102,85,102",
					"cs": {
						"101": {
							"items": "102,85,102",
							"cs": {
								"010": {
									"items": "102,85,102",
									"cs": {}
								}
							}
						},
						"001": {
							"items": "85,85,119",
							"cs": {
								"111": {
									"items": "85,85,119",
									"cs": {}
								}
							}
						}
					}
				}
			}
		}
	}
}`)

console.time('closest');
const col1 = t1.closest(hexToRgb('556'));
console.timeEnd('closest');

assert.deepEqual(col1, { name: 'Test', coords: hexToRgb('557'), d2: 289 });


console.time('add');
const t2 = new Octree(
	[{ name: 'Test', hex: '557' }, { name: 'Test_', hex: '656' }],
	{ key: 'hex', transform: hexToRgb, depth: 1 }
);
console.timeEnd('add');

assert.equal(JSON.stringify(t2, null, '\t'), `{
	"items": "",
	"cs": {
		"000": {
			"items": "557, 656",
			"cs": {
				"111": {
					"items": "557, 656",
					"cs": {
						"101": {
							"items": "656",
							"cs": {}
						},
						"001": {
							"items": "557",
							"cs": {}
						}
					}
				}
			}
		}
	}
}`)

console.time('closest');
const col2 = t2.closest('556');
console.timeEnd('closest');

assert.deepEqual(col2, { name: 'Test', hex: '557', d2: 289 });


// ###################
console.log('\n## color-names (148 colors)');

const colors = Object.entries(colorNames).map(([hex, name]) => ({ name, hex }));

console.time('add');
const t3 = new Octree(colors, { key: 'hex', transform: hexToRgb });
console.timeEnd('add');

console.time('closest');
const col3 = t3.closest('556');
console.timeEnd('closest');

assert.deepEqual(col3, { hex: '#585562', name: 'Scarpa Flow', d2: 25 });

// ####################
console.log('\n## color-name-list (17k colors)');

console.time('add');
const t4 = new Octree(colorNameList, { key: 'hex', transform: hexToRgb });
console.timeEnd('add');

console.time('closest');
const col4 = t4.closest('556');
console.timeEnd('closest');

assert.deepEqual(col4, { name: 'Freefall', hex: '#565266', d2: 10 });

console.time('remove');
t4.remove('#565266');
console.timeEnd('remove');

console.time('closest');
const col31 = t4.closest('556');
console.timeEnd('closest');

assert.deepEqual(col31, { name: 'Inky Storm', hex: '#535266', d2: 13 });

console.time('remove');
t4.remove('#535266');
console.timeEnd('remove');

console.time('closest');
const col32 = t4.closest('556');
console.timeEnd('closest');

assert.deepEqual(col32, {
	name: `Black Dragon's Caldron`,
	hex: '#545562',
	d2: 17
});
