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
} from './vite.base.config';

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
        formats: ['es'],
      },
      rolldownOptions: {
        external,
        output: {
          format: 'es',
          entryFileNames: '[name].js',
        }
      },
      ssr: true,
    },
    plugins: [pluginHotRestart('restart')],
    define,
    resolve: {
      alias: getTsconfigAlias(),
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
    ssr: {
      // This tells Vite: "Do not try to bundle electron, 
      // and when you reference it, use an ESM 'import'."
      external: ['electron'], // Probably applies to other node built-ins.
      noExternal: ['trpc-electron'], // Probably everything else.
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
