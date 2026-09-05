import ts from 'typescript';

/**
 * useViewScript内のコールバックから参照してよいブラウザ標準API・グローバル。
 * これ以外の外部スコープ参照はビルド時エラーにする。
 */
const GLOBAL_WHITELIST = new Set<string>([
  'window', 'document', 'console', 'Math', 'JSON', 'Array', 'Object', 'String',
  'Number', 'Boolean', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'RegExp',
  'Date', 'Symbol', 'Error', 'TypeError', 'RangeError', 'SyntaxError',
  'Infinity', 'NaN', 'undefined', 'arguments',
  // esbuildが `const fn = (...) => {}` を `__name(fn, "fn")` へ包む際に使う
  // 名前保持用ヘルパー。生成JS側にpolyfillを用意して吸収する。
  '__name',
  'requestAnimationFrame', 'cancelAnimationFrame',
  'requestIdleCallback', 'cancelIdleCallback',
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'fetch', 'URL', 'URLSearchParams',
  'Element', 'HTMLElement', 'Node', 'NodeList', 'Event', 'CustomEvent',
  'MutationObserver', 'ResizeObserver', 'IntersectionObserver',
  'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement',
  'HTMLButtonElement', 'HTMLFormElement', 'HTMLAnchorElement',
  'HTMLUListElement', 'HTMLOListElement', 'HTMLLIElement',
  'HTMLDivElement', 'HTMLSpanElement', 'HTMLParagraphElement',
  'HTMLImageElement', 'HTMLLabelElement', 'HTMLFieldSetElement',
  'FormData', 'FocusEvent', 'KeyboardEvent', 'MouseEvent',
  'PointerEvent', 'TouchEvent', 'WheelEvent', 'SubmitEvent',
  'performance', 'navigator', 'location', 'history',
  'localStorage', 'sessionStorage', 'structuredClone',
  'Reflect', 'Proxy', 'globalThis',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite',
  'encodeURIComponent', 'decodeURIComponent',
]);

const WRAPPER_NAME = '__viewScriptHandler';

function collectBindingNames(name: ts.BindingName, into: Set<string>): void {
  if (ts.isIdentifier(name)) {
    into.add(name.text);
    return;
  }

  for (const element of name.elements) {
    if (ts.isOmittedExpression(element)) continue;
    collectBindingNames(element.name, into);
  }
}

function collectDeclaredNames(node: ts.Node, into: Set<string>): void {
  if (ts.isParameter(node) || ts.isVariableDeclaration(node)) {
    collectBindingNames(node.name, into);
  } else if (
    (ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isClassDeclaration(node) ||
      ts.isClassExpression(node)) &&
    node.name
  ) {
    into.add(node.name.text);
  } else if (ts.isCatchClause(node) && node.variableDeclaration) {
    collectBindingNames(node.variableDeclaration.name, into);
  }

  ts.forEachChild(node, (child) => collectDeclaredNames(child, into));
}

function isNonReferencePosition(identifier: ts.Identifier): boolean {
  const parent = identifier.parent;
  if (!parent) return false;

  if (
    (ts.isParameter(parent) ||
      ts.isVariableDeclaration(parent) ||
      ts.isBindingElement(parent) ||
      ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent) ||
      ts.isArrowFunction(parent)) &&
    parent.name === identifier
  ) {
    return true;
  }

  if (ts.isPropertyAccessExpression(parent) && parent.name === identifier) {
    return true;
  }

  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isGetAccessorDeclaration(parent) ||
      ts.isSetAccessorDeclaration(parent) ||
      ts.isPropertySignature(parent)) &&
    parent.name === identifier
  ) {
    return true;
  }

  if (ts.isLabeledStatement(parent) && parent.label === identifier) return true;
  if (ts.isBreakOrContinueStatement(parent) && parent.label === identifier) return true;
  if (ts.isImportSpecifier(parent) || ts.isExportSpecifier(parent)) return true;

  return false;
}

/**
 * コールバック内のコード文字列を静的に解析し、コールバック引数・
 * コールバック内で宣言した変数以外の識別子参照がないか検証する。
 */
export function validateNoExternalReferences(
  handlerSource: string,
  patternId: string,
): void {
  const wrapped = `const ${WRAPPER_NAME} = (${handlerSource});`;
  const sourceFile = ts.createSourceFile(
    `${patternId}.view-script-source.ts`,
    wrapped,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const boundNames = new Set<string>();
  collectDeclaredNames(sourceFile, boundNames);
  boundNames.delete(WRAPPER_NAME);

  let violation: string | null = null;

  const visit = (node: ts.Node): void => {
    if (violation) return;

    if (
      ts.isIdentifier(node) &&
      node.text !== WRAPPER_NAME &&
      !isNonReferencePosition(node) &&
      !boundNames.has(node.text) &&
      !GLOBAL_WHITELIST.has(node.text)
    ) {
      violation = node.text;
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  if (violation) {
    throw new Error(
      `useViewScript() cannot reference variables declared outside its callback: ${violation}`,
    );
  }
}

/**
 * コールバックの文字列表現からTypeScript構文(型注釈・ジェネリクス等)を除去する。
 */
function stripTypeSyntax(handlerSource: string, patternId: string): string {
  const wrapped = `const ${WRAPPER_NAME} = (${handlerSource});`;

  const result = ts.transpileModule(wrapped, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
    },
  });

  const outputSourceFile = ts.createSourceFile(
    `${patternId}.view-script-output.js`,
    result.outputText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  for (const statement of outputSourceFile.statements) {
    if (
      !ts.isVariableStatement(statement) ||
      statement.declarationList.declarations.length !== 1
    ) {
      continue;
    }

    const declaration = statement.declarationList.declarations[0];

    if (
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === WRAPPER_NAME &&
      declaration.initializer
    ) {
      return declaration.initializer.getText(outputSourceFile);
    }
  }

  throw new Error(`Failed to generate view script for pattern: ${patternId}`);
}

/**
 * useViewScript()に渡されたコールバックから、フロントで読み込む
 * 実行可能なJSモジュールの中身を生成する。
 */
export function buildViewScriptModule(
  handlerSource: string,
  patternId: string,
): string {
  validateNoExternalReferences(handlerSource, patternId);

  let jsSource: string;

  try {
    jsSource = stripTypeSyntax(handlerSource, patternId);
  } catch {
    throw new Error(`Failed to generate view script for pattern: ${patternId}`);
  }

  return `(() => {
  // esbuildが名前保持のため挿入する __name(fn, "name") のpolyfill。
  // .nameの保持自体は不要なので、素通しするだけでよい。
  const __name = (fn) => fn;

  const run = () => {
    const runtime = window.ReactWPRuntime;

    if (!runtime) return;

    const handler = ${jsSource};

    handler(runtime);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
`;
}
