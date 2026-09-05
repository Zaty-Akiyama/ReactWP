import type { ViewScriptHandler } from './view-script-types.js';

let isBuildingPattern = false;
let capturedHandler: ViewScriptHandler | null = null;

/**
 * パターンTSX内から呼び出す、フロント実行処理を登録するためのコンパイル時API。
 *
 * ブラウザ上で実行されるReact Hookではなく、ReactWPのパターンビルド中に
 * 呼び出されコールバックを回収するためのものである。
 */
export function useViewScript(handler: ViewScriptHandler): void {
  if (!isBuildingPattern) {
    throw new Error(
      'useViewScript() must be called while rendering a ReactWP pattern.',
    );
  }

  if (capturedHandler !== null) {
    throw new Error(
      'useViewScript() can only be called once per pattern.',
    );
  }

  capturedHandler = handler;
}

/**
 * ビルドツール専用。パターン描画の開始を記録する。
 */
export function __beginPatternBuild(): void {
  isBuildingPattern = true;
  capturedHandler = null;
}

/**
 * ビルドツール専用。パターン描画を終え、登録されたコールバックを回収する。
 */
export function __endPatternBuild(): ViewScriptHandler | null {
  isBuildingPattern = false;
  const handler = capturedHandler;
  capturedHandler = null;
  return handler;
}
