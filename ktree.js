// polyfills
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (fn) {
    return [].concat(...this.map(fn))
  }
}
if (!String.prototype.padStart) {
  String.prototype.padStart = function (n, c) {
    return (String(c).repeat(n) + this).slice(0, n)
  }
}

// carterian products
export const cart = (...args) => args.reduce((xs, a) => xs.flatMap(xsi => a.map(ai => [...xsi, ai])), [[]]);

const NS2 = cart([-1, 0, 1], [-1, 0, 1]);

export const neighbors2 = ([x, y]) => {
  const xDec = parseInt(x, 2);
  const yDec = parseInt(y, 2);
  const nodes = [];
  const n = x.length, N = 2 ** n;
  for (let i = 0; i < NS2.length; i++) {
    const X = xDec + NS2[i][0],
      Y = yDec + NS2[i][1];
    if (X >= 0 && X < N && Y >= 0 && Y < N) {
      nodes.push([
        X.toString(2).padStart(n, 0),
        Y.toString(2).padStart(n, 0)
      ]);
    }
  }
  return nodes;
};

const NS3 = cart([-1, 0, 1], [-1, 0, 1], [-1, 0, 1]);

export const neighbors3 = ([x, y, z]) => {
  const xDec = parseInt(x, 2);
  const yDec = parseInt(y, 2);
  const zDec = parseInt(z, 2);
  const nodes = [];
  const n = x.length, N = 2 ** n;
  for (let i = 0; i < NS3.length; i++) {
    const X = xDec + NS3[i][0],
      Y = yDec + NS3[i][1],
      Z = zDec + NS3[i][2];
    if (X >= 0 && X < N && Y >= 0 && Y < N && Z >= 0 && Z < N) {
      nodes.push([
        X.toString(2).padStart(n, 0),
        Y.toString(2).padStart(n, 0),
        Z.toString(2).padStart(n, 0)
      ]);
    }
  }
  return nodes;
};

const dist2 = (c1, c2) => (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2;
const dist3 = (c1, c2) => (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2;
const distk = (c1, c2) => c1.map((_, i) => (c1[i] - c2[i]) ** 2).reduce((a, b) => a + b);

const eq2 = (c1, c2) => c1[0] === c2[0] && c1[1] === c2[1];
const eq3 = (c1, c2) => c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
const eqk = (c1, c2) => c1.every((_, i) => c1[i] && c2[i]);

const buildTree2 = (depth, n = 0) =>
  n >= depth
    ? { n, items: [] }
    : {
      n,
      items: [],
      '00': buildTree2(depth, n + 1),
      '01': buildTree2(depth, n + 1),
      '10': buildTree2(depth, n + 1),
      '11': buildTree2(depth, n + 1),
    };
const buildTree3 = (depth, n = 0) =>
  n >= depth
    ? { n, items: [] }
    : {
      n,
      items: [],
      '000': buildTree3(depth, n + 1),
      '001': buildTree3(depth, n + 1),
      '010': buildTree3(depth, n + 1),
      '011': buildTree3(depth, n + 1),
      '100': buildTree3(depth, n + 1),
      '101': buildTree3(depth, n + 1),
      '110': buildTree3(depth, n + 1),
      '111': buildTree3(depth, n + 1),
    };

const getCoord2 = (bins, i) => bins[0][i] + bins[1][i];
const getCoord3 = (bins, i) => bins[0][i] + bins[1][i] + bins[2][i];
const getCoordk = (bins, i) => bins.map(s => s[i]).reduce((a, b) => a + b);


// generate a KTree class for a given k, for k=2, k=3 we try to put inline functions (defined above) for perf
// todo bench if it's really faster
export const ktree = k => {

  const KEYS = cart(...Array.from({ length: k }, () => [0, 1])).map(a => a.join('')); // node's children keys

  let buildTree = buildTree2;
  let getNeighbors = neighbors2;
  if (k === 3) {
    buildTree = buildTree3;
    getNeighbors = neighbors3;
  }
  if (k > 3) {
    buildTree = (depth, n = 0) =>
      n >= depth
        ? { n, items: [] }
        : {
          n,
          items: [],
          ...keys.reduce((o, key) => ({ ...o, [key]: buildTree(depth, n + 1) }), {})
        };
    const NSk = cart(...Array.from({ length: k }, () => [-1, 0, 1]));
    getNeighbors = bins => {
      const decs = bins.map(b => parseInt(b, 2))
      const nodes = [];
      const n = decs[0].length, N = 2 ** n;
      for (let i = 0; i < NSk.length; i++) {
        const X = xDec + NS3[i][0],
          Y = yDec + NS3[i][1],
          Z = zDec + NS3[i][2];
        const coords = decs.map((dec, j) => dec + NSk[i][j]);
        if (coords.every(coord => coord >= 0 && coord < N)) {
          nodes.push(coords.map(coord => coord.toString(2).padStart(n, 0)));
        }
      }
      return nodes;
    };
  }

  const eq = k === 2 ? eq2 : k === 3 ? eq3 : eqk;
  const dist = k === 2 ? dist2 : k === 3 ? dist3 : distk;

  const getCoord = k === 2 ? getCoord2 : k === 3 ? getCoord3 : getCoordk;

  return class KTree {
    constructor(items = [], { length = 8, depth = 4, key = 'coords', transform = x => x } = {}) {
      if (!(depth >= 1 && depth < length)) throw new Error(`initial depth must be between 1 and ${length}`);
      this.len = length;
      this.key = key;
      this.transform = transform;
      this.root = buildTree(depth);
      this.add(items);
    }
    coordsToBin(coords) {
      return coords.map(x => x.toString(2).padStart(this.len, 0));
    }
    add(items = []) {
      const data = !Array.isArray(items) ? [items] : items;
      data.forEach(c => this._add(c));
    }
    _add(item, root = this.root) {
      let node = root;
      const bins = this.coordsToBin(this.transform(item[this.key]));
      for (let i = root.n; i < this.len; i++) {
        const k = getCoord(bins, i);
        if (!node[k]) break;
        node = node[k];
        node.items.push(item);
      }
      if (node.items.length > 1 && node.n < this.len - 1) { // expand further, to get a fastest .closest
        KEYS.forEach(k => {
          node[k] = buildTree(node.n + 1, node.n + 1);
        });
        node.items.forEach(it => this._add(it, node));
      }
    }
    remove(value) {
      let node = this.root;
      const coords = this.transform(value);
      const bins = this.coordsToBin(coords);
      for (let i = 0; i < this.len; i++) {
        const k = getCoord(bins, i);
        node = node[k];
        if (!node) break;
        node.items = Array.isArray(value) // todo clean that and set an isEqual 
          ? node.items.filter(c => !eq(value, c[this.key]))
          : node.items.filter(c => value !== c[this.key]);
      }
    }
    closest(value) {
      const coords = this.transform(value);
      const bins = this.coordsToBin(coords);
      const node = this.getNodeFromCoords(bins);
      for (let i = node.n; i > 0; i--) {
        const parentBins = bins.map(s => s.slice(0, i));
        const ns = getNeighbors(parentBins, getCoord(bins, i));
        const items = ns
          .map(n => this.getNodeFromCoords(n).items)
          .reduce((cs, c) => cs.concat(c));
        if (items.length) {
          return this.closestIn(coords, items);
        }
      }
      // search in all
      const items = KEYS
        .map(k => this.root[k].items)
        .reduce((cs, c) => cs.concat(c));
      if (items.length) {
        return this.closestIn(coords, items);
      }
      // console.log(`Couldn't find any item`);
    }
    getNodeFromCoords(coords) {
      let node = this.root;
      for (let i = 0; i < coords[0].length && node[KEYS[0]]; i++) {
        node = node[getCoord(coords, i)];
      }
      return node;
    }
    closestIn(coords, items) {
      let minD = Infinity,
        current;
      items.forEach(item => {
        const d = dist(coords, this.transform(item[this.key]));
        if (d < minD) {
          minD = d;
          current = item;
        }
      });
      return { ...current, d: minD ** .5 };
    }
    toJSON(indent = '') {
      return JSON.stringify(prettify(this.root, this.key), null, indent);
    }
  };
};


export const prettify = ({ n, items = [], ...o } = {}, key) => n === 0 || items.length ? ({
  items: items.map(x => x.name).join(', '), // items.map(x => `${x.name}: ${x[key]}`),
  ['_' + n]: Object.keys(o).reduce((a, k) => ({ ...a, [k]: prettify(o[k], key) }), {}) // group children keys together else 0 come before n/items
}) : undefined;

