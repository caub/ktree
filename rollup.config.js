import babel from 'rollup-plugin-babel';

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
    }),
  ],
};
