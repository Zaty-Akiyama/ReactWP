import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const srcRoot = path.resolve('patterns/_src');

let building = false;
let pendingFile: string | 'all' | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function runBuild(file?: string) {
  if (building) {
    if (!file || pendingFile === 'all' || (pendingFile !== null && pendingFile !== file)) {
      pendingFile = 'all';
    } else {
      pendingFile = file;
    }
    return;
  }

  building = true;
  const args = file ? [`--file=${file}`] : [];

  const proc = spawn('npm', ['run', 'build:patterns', '--', ...args], {
    stdio: 'inherit',
    shell: true,
  });

  proc.on('close', () => {
    building = false;
    if (pendingFile !== null) {
      const next = pendingFile === 'all' ? undefined : pendingFile;
      pendingFile = null;
      runBuild(next);
    }
  });
}

function resolvePatternFile(filename: string): string | undefined {
  if (filename.endsWith('.tsx')) {
    return path.join(srcRoot, filename);
  }
  if (filename.endsWith('.module.css')) {
    return path.join(srcRoot, filename.replace(/\.module\.css$/, '.tsx'));
  }
}

function scheduleRebuild(filename: string) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const file = resolvePatternFile(filename);
    console.log(`\nChanged: ${filename}${file ? '' : ' (full rebuild)'}`);
    runBuild(file);
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
