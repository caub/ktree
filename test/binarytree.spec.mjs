import assert from 'assert';
import { ktree } from '../ktree';

const Binarytree = ktree(1);

const tf = x => [parseInt(x, 16)];

const data = [ // distance to 36
  '12',
  '39',
  '58'
];

const t = new Binarytree(
  data.map(x => ({ name: x })),
  { key: 'name', transform: tf, depth: 1 }
);

const results = [];

for (; ;) {
  const item = t.closest('36');

  if (!item) break;

  results.push(item);

  t.remove(item.name);
}

assert.deepEqual(results, [
  { name: '39', d: 3 },
  { name: '58', d: 34 },
  { name: '12', d: 36 }
]);

assert.equal(JSON.stringify(t), `{"items":"","cs":{}}`);
