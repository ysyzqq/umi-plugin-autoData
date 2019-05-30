import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
export default [
  {
    input: './src/index.ts',
    output: {
      file: './lib/index.js',
      format: 'cjs'
    },
    plugins: [
      typescript(),
      commonjs()
    ],
    external: ['path', 'fs', 'globby']
  },
  {
    input: './src/autoData.tsx',
    output: {
      file: './lib/autoData.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      commonjs()
    ],
    external: ['path', 'fs', 'globby', 'react', 'react-router-dom']
  }
]
