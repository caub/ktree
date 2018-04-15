import fs from 'fs';
import babel from 'rollup-plugin-babel';

const babelrc = JSON.parse(fs.readFileSync('./.babelrc') + '');
babelrc.presets[0][1].modules = false;

export default {
  input: 'index.js',
  output: [
    {
      format: 'es',
      file: 'dist/es.js',
    },
    {
      format: 'umd',
      file: 'dist/umd.js',
      name: 'colorutil',
    },
    {
      format: 'cjs',
      file: 'dist/cjs.js',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      ...babelrc
    }),
  ],
};
