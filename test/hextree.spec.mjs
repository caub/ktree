import assert from 'assert';
import { ktree } from '../ktree';

const Hextree = ktree(4);

const tf = x => [x.slice(0, 2), x.slice(2, 4), x.slice(4, 6), x.slice(6)].map(x => parseInt(x, 16));

const data = [
  '12345678',
  '13395578',
  '11324798',
  '13302357',
];

const t = new Hextree(
  data.map(x => ({ name: x })),
  { key: 'name', transform: tf, depth: 1 }
);

const results = [];

for (; ;) {
  const item = t.closest('12365475');

  if (!item) break;

  results.push(item);

  t.remove(item.name);
}
assert.deepEqual(results, [
  { name: '12345678', d2: 17 },
  { name: '13395578', d2: 20 },
  { name: '11324798', d2: 1411 },
  { name: '13302357', d2: 3338 }
]);

assert.equal(JSON.stringify(t), `{"items":"","cs":{}}`);
