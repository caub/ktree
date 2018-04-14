export const parseHex = hex =>
  hex.length < 6
    ? hex[hex.length - 3].repeat(2) + hex[hex.length - 2].repeat(2) + hex[hex.length - 1].repeat(2)
    : hex.slice(-6);

const hexToRgb = hex => {
  const h = parseHex(hex);
  return Array.from({ length: 3 }, (_, i) => parseInt(h.slice(2 * i, 2 * i + 2), 16));
};
const distRgb = (c1, c2) => (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2;

export const distHex = (a, b) => distRgb(hexToRgb(a), hexToRgb(b));

const rgbToBin = rgb => rgb.map(x => x.toString(2).padStart(8, 0));

export const hexToBin = hex => rgbToBin(hexToRgb(hex));

const buildOctree = (depth, n = 0) =>
  n > depth
    ? undefined
    : {
        n,
        colors: [],
        '000': buildOctree(depth, n + 1),
        '001': buildOctree(depth, n + 1),
        '010': buildOctree(depth, n + 1),
        '011': buildOctree(depth, n + 1),
        '100': buildOctree(depth, n + 1),
        '101': buildOctree(depth, n + 1),
        '110': buildOctree(depth, n + 1),
        '111': buildOctree(depth, n + 1),
      };

export let __root;

/**
 * init __root
 * @param {*} depth 
 */
export const init = ({depth = 7} = {}) => {
  __root = buildOctree(depth); // 8 would go down to leaves, but it's too intense for nodejs
};

export const add = (cols, {depth, reset}) => {
  if (!__root || reset) init({depth});
  if (Array.isArray(cols)) {
    return cols.forEach(c => _add(c)); // might want to precmpute rgb to spped up search
  }
  _add(cols);
};

const _add = col => {
  let node = __root;
  const bin = hexToBin(col.hex);
  for (let i = 0; i < 7; i++) {
    const k = bin[0][i] + bin[1][i] + bin[2][i];
    node = node[k];
    if (!node) break;
    node.colors.push(col);
  }
};

/**
 * get neighbors of a given node
 * example: neighbors(['0010', '1101', '0101'], '000') will get the 7 neighbors of this node next the firsr corner ('000')
 */
const neighbors = ([r, g, b], dir) => {
  const rDec = parseInt(r, 2);
  const gDec = parseInt(g, 2);
  const bDec = parseInt(b, 2);
  const nodes = [];
  const n = r.length;
  for (let dr = dir[0] - 1; dr <= dir[0]; dr++) {
    for (let dg = dir[1] - 1; dg <= dir[1]; dg++) {
      for (let db = dir[2] - 1; db <= dir[2]; db++) {
        const R = rDec + dr,
          G = gDec + dg,
          B = bDec + db;
        if (R >= 0 && R < 2 ** n && G >= 0 && G < 2 ** n && B >= 0 && B < 2 ** n) {
          nodes.push([
            R.toString(2).padStart(n, 0),
            G.toString(2).padStart(n, 0),
            B.toString(2).padStart(n, 0),
          ]);
        }
      }
    }
  }
  return nodes;
};

const getNodeFromCoords = ([r, g, b]) => {
  let node = __root;
  for (let i = 0; i < 7; i++) {
    if (!node[r[i] + g[i] + b[i]]) break;
    node = node[r[i] + g[i] + b[i]];
  }
  return node;
};

export const closest = hex => {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgbToBin(rgb);
  // reminder: we don't/can't store level 8
  for (let i = 7; i > 0; i--) {
    const coords = [r.slice(0, i), g.slice(0, i), b.slice(0, i)]; // take one resolution higher, since we don't/can't store level 8
    const ns = neighbors(coords, r[i] + g[i] + b[i]);
    const colors = ns.reduce((cs, n) => cs.concat(getNodeFromCoords(n).colors), []);
    if (colors.length) {
      return closestIn(rgb, colors);
    }
  }
  // search in all
  const colors = ['000', '001', '010', '011', '100', '101', '110', '111'].reduce(
    (cs, c) => cs.concat(__root[c].colors),
    [],
  );
  if (colors.length) {
    return closestIn(rgb, colors);
  }
  console.log(`Couldn't find any color`);
};

const closestIn = (rgb, colors) => {
  let minDist = Infinity,
    best;
  colors.forEach(col => {
    const d = distRgb(hexToRgb(col.hex), rgb);
    if (d < minDist) {
      minDist = d;
      best = col;
    }
  });
  return { ...best, d: minDist ** 0.5 };
};
