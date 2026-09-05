import { existsSync, watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const srcRoot = path.resolve('patterns/_src');
const componentsRoot = path.resolve('components');

type BuildTarget = string | 'all';

let building = false;
let pendingFile: BuildTarget | null = null;
let scheduledFile: BuildTarget | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function runBuild(file?: string): void {
  if (building) {
    if (
      !file ||
      pendingFile === 'all' ||
      (pendingFile !== null && pendingFile !== file)
    ) {
      pendingFile = 'all';
    } else {
      pendingFile = file;
    }

    return;
  }

  building = true;

  const args = file ? [`--file=${file}`] : [];

  const proc = spawn(
    'npm',
    ['run', 'build:patterns', '--', ...args],
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  proc.on('close', (code) => {
    building = false;

    if (code !== 0) {
      console.error(`Pattern build failed: ${code}`);
    }

    if (pendingFile !== null) {
      const next =
        pendingFile === 'all'
          ? undefined
          : pendingFile;

      pendingFile = null;
      runBuild(next);
    }
  });
}

/**
 * パターン本体またはCSSから、対応するTSXを取得する
 */
function resolvePatternFile(
  filename: string,
): string | undefined {
  let file: string | undefined;

  if (filename.endsWith('.tsx')) {
    file = path.join(srcRoot, filename);
  }

  if (filename.endsWith('.module.css')) {
    file = path.join(
      srcRoot,
      filename.replace(/\.module\.css$/, '.tsx'),
    );
  }

  return file && existsSync(file)
    ? file
    : undefined;
}

/**
 * ビルド予約をまとめる
 *
 * 複数ファイル変更または共通コンポーネント変更時は
 * 全パターンを再ビルドする
 */
function scheduleRebuild(
  target: BuildTarget,
  changedPath: string,
): void {
  if (
    target === 'all' ||
    scheduledFile === 'all' ||
    (
      scheduledFile !== null &&
      scheduledFile !== target
    )
  ) {
    scheduledFile = 'all';
  } else {
    scheduledFile = target;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    const next = scheduledFile;
    scheduledFile = null;

    console.log(
      `\nChanged: ${changedPath}${
        next === 'all' ? ' (full rebuild)' : ''
      }`,
    );

    runBuild(
      next === 'all'
        ? undefined
        : next ?? undefined,
    );
  }, 100);
}

/**
 * 初回ビルド
 */
runBuild();

/**
 * パターン本体を監視
 */
watch(
  srcRoot,
  {
    recursive: true,
    encoding: 'utf8',
  },
  (_, filename) => {
    if (!filename) {
      return;
    }

    if (
      !filename.endsWith('.tsx') &&
      !filename.endsWith('.module.css')
    ) {
      return;
    }

    const patternFile = resolvePatternFile(filename);

    scheduleRebuild(
      patternFile ?? 'all',
      `patterns/_src/${filename}`,
    );
  },
);

/**
 * 共通コンポーネントを監視
 */
if (existsSync(componentsRoot)) {
  watch(
    componentsRoot,
    {
      recursive: true,
      encoding: 'utf8',
    },
    (_, filename) => {
      if (!filename) {
        return;
      }

      if (
        !filename.endsWith('.tsx') &&
        !filename.endsWith('.module.css')
      ) {
        return;
      }

      // どのパターンが利用しているか判定しないため全ビルド
      scheduleRebuild(
        'all',
        `components/${filename}`,
      );
    },
  );
}

/**
 * 共通ランタイムを監視
 */
const runtimeSrcRoot = path.resolve('core/runtime/_src');

if (existsSync(runtimeSrcRoot)) {
  watch(
    runtimeSrcRoot,
    {
      recursive: true,
      encoding: 'utf8',
    },
    (_, filename) => {
      if (!filename || !filename.endsWith('.ts')) {
        return;
      }

      scheduleRebuild(
        'all',
        `core/runtime/_src/${filename}`,
      );
    },
  );
}

console.log(`Watching ${srcRoot} ...`);
console.log(`Watching ${componentsRoot} ...`);
console.log(`Watching ${runtimeSrcRoot} ...`);