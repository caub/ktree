import babel from 'rollup-plugin-babel';

export default {
  input: 'index.js',
  output: [
    {
      format: 'es',
      file: 'dist/ktree.es.js',
    },
    {
      format: 'umd',
      file: 'dist/ktree.umd.js',
      name: 'ktree',
    },
    {
      format: 'cjs',
      file: 'dist/ktree.cjs.js',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
