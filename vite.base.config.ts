import { builtinModules } from 'node:module';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'path';
import { getTsconfig } from 'get-tsconfig';
import type {
  ConfigEnv,
  Plugin,
  UserConfig
} from 'vite' with { 'resolution-mode': 'import' };
import pkg from './package.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const builtins = [
  'electron', ...builtinModules.map((m) => [m, `node:${m}`]).flat()
];

const dependencies = Object
  .keys('dependencies' in pkg ? (pkg.dependencies as Record<string, unknown>) : {})
  .filter(dep => dep !== 'electron-settings')
;

export const external = [
  ...builtins,
  ...dependencies,
];

export function getBuildConfig(env: ConfigEnv<'build'>): UserConfig {
  const { root, mode, command } = env;

  return {
    root,
    mode,
    build: {
      // Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      // 🚧 Multiple builds may conflict.
      outDir: '.vite/build',
      watch: command === 'serve' ? {} : null,
      minify: command === 'build',
    },
    clearScreen: false,
  };
}

export function getDefineKeys(names: string[]) {
  const define: { [name: string]: VitePluginRuntimeKeys } = {};

  return names.reduce((acc, name) => {
    const NAME = name.toUpperCase();
    const keys: VitePluginRuntimeKeys = {
      VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
      VITE_NAME: `${NAME}_VITE_NAME`,
    };

    return { ...acc, [name]: keys };
  }, define);
}

export function getBuildDefine(env: ConfigEnv<'build'>) {
  const { command, forgeConfig } = env;
  // TODO: Find out what this should do and type appropriately.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const names = forgeConfig.renderer.filter(({ name }) => name != null).map(({ name }) => name!);
  const defineKeys = getDefineKeys(names);
  const define = Object.entries(defineKeys).reduce((acc, [name, keys]) => {
    const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
    const def = {
      [VITE_DEV_SERVER_URL]: command === 'serve' ? JSON.stringify(process.env[VITE_DEV_SERVER_URL]) : undefined,
      [VITE_NAME]: JSON.stringify(name),
    };
    return { ...acc, ...def };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  return define;
}

export function pluginExposeRenderer(name: string): Plugin {
  const { VITE_DEV_SERVER_URL } = getDefineKeys([name])[name];

  return {
    name: '@electron-forge/plugin-vite:expose-renderer',
    configureServer(server) {
      process.viteDevServers ??= {};
      // Expose server for preload scripts hot reload.
      process.viteDevServers[name] = server;

      server.httpServer?.once('listening', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const addressInfo = server.httpServer!.address() as AddressInfo;
        // Expose env constant for main process use.
        process.env[VITE_DEV_SERVER_URL] = `http://localhost:${addressInfo?.port}`;
      });
    },
  };
}

export function pluginHotRestart(command: 'reload' | 'restart'): Plugin {
  return {
    name: '@electron-forge/plugin-vite:hot-restart',
    closeBundle() {
      if (command === 'reload') {
        for (const server of Object.values(process.viteDevServers)) {
          // Preload scripts hot reload.
          server.ws.send({ type: 'full-reload' });
        }
      } else {
        // Main process hot restart.
        // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit('data', 'rs');
      }
    },
  };
}

export const getTsconfigAlias = () => {
  // 1. Get the parsed tsconfig (handles 'extends' automatically)
  const tsconfig = getTsconfig();
  const paths = tsconfig?.config.compilerOptions?.paths || {};

  // 2. Convert TS paths to Vite aliases
  const alias = Object.keys(paths).reduce((acc, key) => {
    // Remove trailing "/*" from alias key (e.g., "@main/*" -> "@main")
    const name = key.replace(/\/\*$/, '');
    // Remove trailing "/*" from the first path entry and resolve it
    const target = paths[key][0].replace(/\/\*$/, '');

    acc[name] = path.resolve(__dirname, target);
    return acc;
  }, {} as Record<string, string>);

  return alias;
};