import {
  defineConfig,
  externalizeDepsPlugin,
} from 'electron-vite'
import {
  getTsconfigAlias,
  pluginHotRestart
} from './vite.base.config';
import { resolve } from 'path'

const external = [
  '@trpc/server',
  '@trpc/server/observable',
  'electron',
];

const stripContextBridgePlugin = {
  name: 'strip-context-bridge',
  transform(code: string, id: string) {
    if (id.includes('trpc-electron')) {
      // This regex finds the contextBridge import and deletes it from the library code
      return code
        .replace(/contextBridge\s*as\s*\w+,?/g, '')
        .replace(/ipcRenderer\s*as\s*\w+,?/g, '')
      ;
    }
  }
};

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        formats: ['es'],
      },
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
      externalizeDepsPlugin(),
      pluginHotRestart('restart'),
      stripContextBridgePlugin,
    ],
    resolve: {
      alias: getTsconfigAlias(),
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/preload.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['electron'],
      },
    },
    plugins: [
      externalizeDepsPlugin(),
    ],
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          browser: resolve(__dirname, 'index.html'),
        },
      },
    },
    plugins: [
      externalizeDepsPlugin({
        include: ['electron'],
      }),
    ],
    resolve: {
      alias: getTsconfigAlias(),
    },
  },
});
