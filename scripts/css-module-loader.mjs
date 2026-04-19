import postcss from 'postcss';
import postcssModules from 'postcss-modules';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const perPatternDir = path.join(process.cwd(), 'styles', '_per-pattern');

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.module.css')) {
    return nextLoad(url, context);
  }

  const filePath = fileURLToPath(url);
  const css = readFileSync(filePath, 'utf8');

  let classMap = {};
  const result = await postcss([
    postcssModules({
      generateScopedName(local, filename) {
        const name = path.basename(filename, '.module.css');
        return `${name}__${local}`;
      },
      getJSON(_, json) {
        classMap = json;
      },
    }),
  ]).process(css, { from: filePath });

  const name = path.basename(filePath, '.module.css');
  mkdirSync(perPatternDir, { recursive: true });
  writeFileSync(path.join(perPatternDir, `${name}.css`), result.css);

  return {
    format: 'module',
    shortCircuit: true,
    source: `export default ${JSON.stringify(classMap)};`,
  };
}
