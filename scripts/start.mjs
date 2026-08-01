import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import process from 'node:process';

const requiredNodeMajor = 20;
const nodeMajor = Number(process.versions.node.split('.')[0]);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const url = 'http://localhost:3000';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code ?? 'unknown'}`));
    });
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

function openBrowser() {
  const commands = {
    win32: ['cmd', ['/c', 'start', '', url]],
    darwin: ['open', [url]],
    linux: ['xdg-open', [url]],
  };
  const entry = commands[process.platform];

  if (!entry) return;

  const child = spawn(entry[0], entry[1], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

if (!Number.isFinite(nodeMajor) || nodeMajor < requiredNodeMajor) {
  console.error(`LootQuest requires Node.js ${requiredNodeMajor} or newer.`);
  console.error('Install it from https://nodejs.org and run the launcher again.');
  process.exit(1);
}

try {
  if (!existsSync('node_modules/next/package.json')) {
    console.log('Installing LootQuest for the first time...');
    await run(npmCommand, ['install']);
  }

  console.log(`Starting LootQuest at ${url}`);
  const server = spawn(npmCommand, ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  waitForServer().then((ready) => {
    if (ready) {
      openBrowser();
      console.log('LootQuest is ready. Keep this window open while playing.');
    } else {
      console.log(`Open ${url} in your browser when the server is ready.`);
    }
  });

  const stop = () => {
    server.kill('SIGTERM');
    process.exit(0);
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  server.on('exit', (code) => process.exit(code ?? 0));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
