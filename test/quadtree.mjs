import assert from 'assert';
import { Quadtree } from '../index';

const tf = x => [x.slice(0, 2), x.slice(2, 4)].map(x => parseInt(x, 16));

const data = [ // distance to 1236
  '1234',// 2
  '1339',// 3.16
  '1132',// 4.12
  '1330',// 6.08
  '1141',// 11.04
  '1129',// 13.03
  '1327',// 15.03
  '2124',// 23.43
  '1001',// 53.03
  '1595' // 95.04
];

const t = new Quadtree(
  data.map(x => ({ name: x })),
  { key: 'name', transform: tf, depth: 1 }
);

const results = [];

for (; ;) {
  const item = t.closest('1236');

  if (!item) break;

  results.push(item);

  t.remove(item.name);
}
assert.deepEqual(results, [
  { name: '1234', d: 2 },
  { name: '1339', d: 3.1622776601683795 },
  { name: '1132', d: 4.123105625617661 },
  { name: '1330', d: 6.082762530298219 },
  { name: '1141', d: 11.045361017187261 },
  { name: '1129', d: 13.038404810405298 },
  { name: '1327', d: 15.033296378372908 },
  { name: '2124', d: 23.430749027719962 },
  { name: '1001', d: 53.03772242470448 },
  { name: '1595', d: 95.04735661763561 }
]);
