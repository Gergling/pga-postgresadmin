import {
  defineConfig,
} from 'electron-vite'
import { resolve } from 'path'
import {
  getTsconfigAlias,
  pluginHotRestart
} from './vite.base.config';

const noExternal = ['electron-updater', 'trpc-electron'];

const exclude = ['electron', ...noExternal];

const external = [
  '@trpc/server',
  '@trpc/server/observable',
];

const outDirRoot = 'dist';

export default defineConfig({
  main: {
    build: {
      externalizeDeps: { exclude },
      lib: {
        entry: resolve(import.meta.dirname, 'src/main.ts'),
        formats: ['es'],
      },
      outDir: `${outDirRoot}/main`,
      rollupOptions: {
        external,
        output: {
          codeSplitting: false,
          manualChunks: undefined,
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
      },
    },
    plugins: [
      pluginHotRestart('restart'),
    ],
    resolve: {
      alias: {
        ...getTsconfigAlias(),
        // Shim electron because preload imports end up there.
        'electron': resolve(import.meta.dirname, 'electron-shim-main.js'),
      },
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
    // Force it to bundle so the alias will work.
    ssr: { noExternal },
  },
  preload: {
    build: {
      externalizeDeps: { exclude },
      lib: {
        entry: resolve(import.meta.dirname, 'src/preload.ts'),
        formats: ['es'],
      },
      outDir: `${outDirRoot}/preload`,
    },
    resolve: {
      alias: {
        ...getTsconfigAlias(),
        // Shim electron because main imports end up there.
        'electron': resolve(import.meta.dirname, 'electron-shim-preload.js'),
      },
    },
    // Force it to bundle so the alias works
    ssr: { noExternal },
  },
  renderer: {
    root: '.',
    build: {
      outDir: `${outDirRoot}/renderer`,
      rollupOptions: {
        input: {
          browser: resolve(import.meta.dirname, 'index.html'),
        },
      },
    },
    resolve: { alias: getTsconfigAlias() },
  },
});
