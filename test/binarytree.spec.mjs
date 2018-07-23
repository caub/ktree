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

assert.deepEqual(results.map(({ name, d2 }) => ({ name, d2 })), [
  { name: '39', d2: 9 },
  { name: '58', d2: 1156 },
  { name: '12', d2: 1296 }
]);

assert.equal(JSON.stringify(t), `{"items":"","cs":{}}`);
