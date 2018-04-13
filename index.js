const parseHex = hex => hex.length < 6 ? hex[hex.length-3].repeat(2)+hex[hex.length-2].repeat(2)+hex[hex.length-1].repeat(2) : hex.slice(-6);

const dist = (c1, c2) => (c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2;

const hexToRgb = hex => Array.from({length:3}, (_,i)=>parseInt(hex.slice(2*i, 2*i+2), 16));

const hexToOctants = hex => {
  const [r,g,b] = Array.from({length:3}, (_,i)=>parseInt(hex.slice(2*i, 2*i+2), 16).toString(2).padStart(8,0))
  return Array.from({length:8}, (_,i) => r[i]+g[i]+b[i]);
}


export default class ColorOctant {
  constructor(path = []) {
    this.path = path;
    this.colors = [];

    if (!path.length) {
      this.closest = hex => {
        const octants = hexToOctants(parseHex(hex));
        let child = this;
        for (const octant of octants) {
          if (!child[octant] || !child[octant].colors.length) break;
          
          child = child[octant]
        }

        if (child.colors.length === 1) return child.colors[0];
        const targ = hexToRgb(parseHex(hex))
        let maxDist = Infinity, closest;
        child.colors.forEach(col => {
          const c = hexToRgb(parseHex(col.hex));
          const d = dist(c, targ);
          if (d < maxDist) {
            maxDist = d;
            closest = col;
          }
        });
        return Object.assign({d: maxDist}, closest);
      }
    }
  }

  addAll(colors) {
    colors.forEach(({hex, name}) => this.add({hex, name, octants: hexToOctants(parseHex(hex))}));
  }

  add(color) {
    if (this.path.length >= 8 || !this.colors.length) {
      this.colors.push(color);
      return;
    }
    // else we need to go deeper
    // get first octant of each color, and put them in corresponding child for this octant
    this.colors.concat(color).forEach(({hex, name, octants: [octant, ...rest]}) => {
      const child = this.child(octant);
      child.add({hex, name, octants: rest});
    });
  }

  child(octant) {
    if (this[octant]) return this[octant];
    
    this[octant] = new ColorOctant(this.path.concat(octant));
    return this[octant];
  }
}
