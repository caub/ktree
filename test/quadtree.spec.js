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

let item = t.closest('1236');
console.log(item);
while (item) {
  t.remove(item.name);

  const nextItem = t.closest('1236');
  console.log(nextItem)
  assert(!nextItem || item.d <= nextItem.d)
  item = nextItem;
}
