import type {
  ConfigEnv,
  UserConfig
} from 'vite' with { 'resolution-mode': 'import' };
import { defineConfig, mergeConfig } from 'vite';
import {
  external,
  getBuildConfig,
  getBuildDefine,
  getTsconfigAlias,
  pluginHotRestart
} from './vite.base.config.js';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const config: UserConfig = {
    build: {
      lib: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        entry: forgeConfigSelf.entry!,
        fileName: () => '[name].js',
        formats: ['cjs'],
      },
      rollupOptions: {
        external,
      },
    },
    optimizeDeps: {
      exclude: ['keytar'],
    },
    plugins: [pluginHotRestart('restart')],
    define,
    resolve: {
      alias: getTsconfigAlias(),
      // Load the Node.js entry.
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
