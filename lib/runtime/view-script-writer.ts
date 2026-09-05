import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VIEW_SCRIPTS_DIR = path.resolve('assets/generated/view-scripts');
const MANIFEST_PATH = path.join(VIEW_SCRIPTS_DIR, 'manifest.json');

type ManifestEntry = { file: string; version: string };
type Manifest = Record<string, ManifestEntry>;

function sanitizeId(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 識別名の解決優先順位: pattern.slugの末尾 -> パターンファイル名。
 */
export function resolveViewScriptId(
  slug: string | undefined,
  fileBaseName: string,
): string {
  const slugTail = slug?.split('/').pop();

  if (slugTail) {
    const sanitized = sanitizeId(slugTail);
    if (sanitized) return sanitized;
  }

  const sanitizedFile = sanitizeId(fileBaseName);
  if (sanitizedFile) return sanitizedFile;

  throw new Error(
    'Unable to resolve a view script name for the current pattern.',
  );
}

function readManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as Manifest;
  } catch {
    return {};
  }
}

function writeManifest(manifest: Manifest): void {
  fs.mkdirSync(VIEW_SCRIPTS_DIR, { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8',
  );
}

function hashContent(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function toThemeRelativePath(absolutePath: string): string {
  return path
    .relative(path.resolve('.'), absolutePath)
    .split(path.sep)
    .join('/');
}

/**
 * 生成JSをファイルへ書き出し、manifestへ登録する。
 */
export function writeViewScript(id: string, content: string): ManifestEntry {
  fs.mkdirSync(VIEW_SCRIPTS_DIR, { recursive: true });

  const filePath = path.join(VIEW_SCRIPTS_DIR, `${id}.js`);
  fs.writeFileSync(filePath, content, 'utf8');

  const entry: ManifestEntry = {
    file: toThemeRelativePath(filePath),
    version: hashContent(content),
  };

  const manifest = readManifest();
  manifest[id] = entry;
  writeManifest(manifest);

  return entry;
}

/**
 * 対象パターンがuseViewScript()を使わなくなった場合に、生成物とmanifestエントリを消す。
 */
export function removeViewScript(id: string): void {
  const manifest = readManifest();

  if (!(id in manifest)) {
    return;
  }

  const filePath = path.resolve(manifest[id].file);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  delete manifest[id];
  writeManifest(manifest);
}

/**
 * フルビルド後に、今回のビルドで触れられなかった古いエントリ・生成物を削除する。
 * パターン削除・リネーム時に生成JSが残り続けるのを防ぐ。
 */
export function reconcileViewScripts(touchedIds: ReadonlySet<string>): void {
  const manifest = readManifest();
  let changed = false;

  for (const id of Object.keys(manifest)) {
    if (touchedIds.has(id)) {
      continue;
    }

    const filePath = path.resolve(manifest[id].file);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    delete manifest[id];
    changed = true;
  }

  if (changed) {
    writeManifest(manifest);
  }
}
