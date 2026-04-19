import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const srcRoot = path.resolve('patterns/_src');

let building = false;
let pending = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function runBuild() {
  if (building) {
    pending = true;
    return;
  }
  building = true;

  const proc = spawn('npm', ['run', 'build:patterns'], {
    stdio: 'inherit',
    shell: true,
  });

  proc.on('close', () => {
    building = false;
    if (pending) {
      pending = false;
      runBuild();
    }
  });
}

function scheduleRebuild(filename: string) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`\nChanged: ${filename}`);
    runBuild();
  }, 100);
}

runBuild();

watch(srcRoot, { recursive: true }, (_, filename) => {
  if (!filename) return;
  if (filename.endsWith('.tsx') || filename.endsWith('.module.css')) {
    scheduleRebuild(filename);
  }
});

console.log(`Watching ${srcRoot} ...`);
