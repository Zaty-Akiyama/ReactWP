import { register } from 'node:module';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderWpNode, renderPatternPhp } from '../lib/render';

register(
  pathToFileURL(path.resolve('scripts/css-module-loader.mjs')).href,
  import.meta.url
);

async function main() {
  const srcRoot = path.resolve('patterns/_src');
  const outRoot = path.resolve('patterns');

  const files = await fg('**/*.tsx', {
    cwd: srcRoot,
    absolute: true
  });

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);

    const Component = mod.default;
    const meta = mod.pattern;

    if (!Component) {
      throw new Error(`default export not found: ${file}`);
    }

    if (!meta) {
      throw new Error(`pattern export not found: ${file}`);
    }

    const element = React.createElement(Component);
    const body = renderWpNode(element);
    const php = renderPatternPhp(meta, body);

    const relative = path.relative(srcRoot, file).replace(/\.tsx$/, '.php');
    const output = path.join(outRoot, relative);

    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, php, 'utf8');

    console.log(`Generated: ${relative}`);
  }
}

main().catch(console.error);