
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/index.js',
  minify: true,
  sourcemap: true,
  format: 'esm',
  target: ['es2020'],
  alias: {
    'react': 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime'
  },
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts'
  }
}).catch(() => process.exit(1));
