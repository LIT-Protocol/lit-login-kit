import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  define: {
    global: 'window',
    'process.env': {},
    'process.version': '"v16.0.0"'
  },
  resolve: {
    alias: {
      crypto: resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: resolve(__dirname, 'node_modules/stream-browserify'),
      assert: resolve(__dirname, 'node_modules/assert'),
      http: resolve(__dirname, 'node_modules/stream-http'),
      https: resolve(__dirname, 'node_modules/https-browserify'),
      os: resolve(__dirname, 'node_modules/os-browserify'),
      url: resolve(__dirname, 'node_modules/url'),
      buffer: resolve(__dirname, 'node_modules/buffer'),
      process: resolve(__dirname, 'node_modules/process/browser')
    }
  },
  server: {
    port: 3000
  },
  plugins: [
    react(),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      requireReturnsDefault: true,
      esmExternals: true,
      transformMixedEsModules: true
    }),
    dts({ 
      include: ['src'],
      rollupTypes: true,
      outDir: 'dist',
      insertTypesEntry: true,
      staticImport: true,
      copyDtsFiles: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lit-login-kit',
      fileName: () => 'index.js',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        'ethers',
        /^@lit-protocol\/.*/,
        /^@ethersproject\/.*/,
        '@radix-ui/react-radio-group',
        '@simplewebauthn/browser',
        '@stytch/react',
        '@stytch/vanilla-js',
        'wagmi',
        'tslib',
        'bn.js',
        'assertion-error',
        'sprintf-js',
        'inherits',
        'depd',
        'js-sha3',
        'hash.js',
        'aes-js',
        'scrypt-js',
        'crypto',
        'stream',
        'assert',
        'http',
        'https',
        'os',
        'url'
      ],
      output: {
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'styles/[name].[ext]',
        interop: 'auto'
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: 'auto',
      requireReturnsDefault: true,
      extensions: ['.js', '.cjs', '.mjs']
    },
    sourcemap: true,
    minify: false,
    target: 'esnext',
    cssCodeSplit: true
  }
});