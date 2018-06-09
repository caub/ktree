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
  { name: '12345678', d: 4.123105625617661 },
  { name: '13395578', d: 4.47213595499958 },
  { name: '11324798', d: 37.5632799419859 },
  { name: '13302357', d: 57.77542730261716 }
]);

assert.equal(JSON.stringify(t), `{"items":"","cs":{}}`);
