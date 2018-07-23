import assert from 'assert';
import { Quadtree } from '../index';
import crypto from 'crypto';

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
assert.deepEqual(results.map(({ name, d2 }) => ({ name, d2 })), [
  { name: '1234', d2: 4 },
  { name: '1339', d2: 10 },
  { name: '1132', d2: 17 },
  { name: '1330', d2: 37 },
  { name: '1141', d2: 122 },
  { name: '1129', d2: 170 },
  { name: '1327', d2: 226 },
  { name: '2124', d2: 549 },
  { name: '1001', d2: 2813 },
  { name: '1595', d2: 9034 }
]);

assert.equal(JSON.stringify(t), `{"items":"","cs":{}}`);

// add test-case that failed in v3

const data2 = ["4f59", "5452"];
const TARGET = '585b';

const t2 = new Quadtree(
  data2.map(x => ({ name: x })),
  { key: 'name', transform: tf, depth: 7 }
);

const Nearest = _data => {
  const data = _data.map(x => ({ name: x, coords: tf(x) }));
  return target => {
    let d2 = Infinity, v;
    const targ = tf(target);
    data.forEach(o => {
      const vl = o.coords;
      const _d2 = (vl[0] - targ[0]) ** 2 + (vl[1] - targ[1]) ** 2;
      if (_d2 < d2) {
        d2 = _d2;
        v = o;
      }
    });
    return { ...v, d2 };
  };
}


const nearest2 = Nearest(data2);

assert.deepEqual(t2.closest(TARGET), nearest2(TARGET));

// more brutal bench and test
const data3 = Array.from({ length: 1500 }, () => crypto.randomBytes(2).toString('hex'));
const targets = Array.from({ length: 500 }, () => crypto.randomBytes(2).toString('hex'));

const nearest3 = Nearest(data3);
const t3 = new Quadtree(
  data3.map(x => ({ name: x })),
  { key: 'name', transform: tf, depth: 7 }
);

const ks = targets.slice();
const ns = targets.slice();

console.time('nearest');
targets.forEach((target, i) => {
  ns[i] = nearest3(target);
});
console.timeEnd('nearest');

console.time('ktree');
targets.forEach((target, i) => {
  ks[i] = t3.closest(target);
});
console.timeEnd('ktree');

targets.forEach((target, i) => {
  const a = ks[i];
  const b = ns[i];
  if (a.name !== b.name && a.d2 !== b.d2) {
    console.log(target, a, b);
    assert(false);
    return
  }
})
