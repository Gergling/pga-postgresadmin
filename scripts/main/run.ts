import { readdirSync } from 'node:fs';
import { resolveProjectPath } from '@main/shared/file';
import { log } from "@main/shared/logging";
import { spawn } from 'node:child_process';

log('Loading main script runner', 'info');

const run = () => {
  const args = process.argv.slice(2);
  const feature = args[0];
  if (!feature) {
    const features = readdirSync(
      resolveProjectPath('scripts', 'main', 'features'),
      { withFileTypes: true }
    ).filter(entry => entry.isDirectory()).map(entry => entry.name).join(', ');
    log(`No feature argument provided. Options include: ${features}`, 'warn');
    return;
  }
  const fnc = args[1];
  if (!fnc) {
    const fncs = readdirSync(
      resolveProjectPath('scripts', 'main', 'features', feature),
      { withFileTypes: true }
    ).map(entry => entry.name).join(', ');
    log(`No function argument provided. Options include: ${fncs}`, 'warn');
    return;
  }
  log(`Starting ${feature} ${fnc}...`, 'info');
  const scriptPath = resolveProjectPath(
    'scripts', 'main', 'features', feature, fnc
  );
  const child = spawn('npx', ['tsx', scriptPath], { 
    shell: true,
    stdio: 'inherit',
  });

  child.on('close', (code) => {
    log(`Child process exited with code ${code}`, 'info');
  });
};

run();
