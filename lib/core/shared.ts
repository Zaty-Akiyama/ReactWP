export function serializeBlockAttrs(attrs: Record<string, unknown>): string {
  const cleaned = Object.fromEntries(
    Object.entries(attrs).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value === '') return false;
      return true;
    })
  );

  return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : '';
}

export function openBlockComment(name: string, attrs: Record<string, unknown>): string {
  const json = serializeBlockAttrs(attrs);
  return json ? `<!-- wp:${name} ${json} -->` : `<!-- wp:${name} -->`;
}

export function closeBlockComment(name: string): string {
  return `<!-- /wp:${name} -->`;
}

export function selfClosingBlockComment(name: string, attrs: Record<string, unknown>): string {
  const json = serializeBlockAttrs(attrs);
  return json ? `<!-- wp:${name} ${json} /-->` : `<!-- wp:${name} /-->`;
}

const DATA_ATTR_KEY_PATTERN = /^data[A-Z]/;

function camelToKebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * `dataFrontHeader` のようなpropsキーを `data-front-header` 属性へ変換する。
 * useViewScript内のフロント処理が固定セレクタとしてDOMを取得するために使う。
 */
export function buildDataAttrs(
  props: Record<string, any>,
  escapeAttr: (value: string) => string,
): string {
  return Object.entries(props)
    .filter(([key, value]) => {
      return (
        DATA_ATTR_KEY_PATTERN.test(key) &&
        value !== undefined &&
        value !== false
      );
    })
    .map(([key, value]) => {
      const attrName = camelToKebabCase(key);
      return value === true
        ? ` ${attrName}`
        : ` ${attrName}="${escapeAttr(String(value))}"`;
    })
    .join('');
}

function presetToCss(value: string): string {
  return value.replace(
    /^var:preset\|([^|]+)\|(.+)$/,
    (_, type, key) => `var(--wp--preset--${type}--${key})`
  );
}

function resolveSpacing(property: string, value: string | Record<string, string>): {
  sides: Record<string, string>;
  css: string;
} {
  const sides =
    typeof value === 'string'
      ? { top: value, right: value, bottom: value, left: value }
      : value;
  const entries = Object.entries(sides).filter(([, v]) => v !== undefined) as [string, string][];
  const css = entries.map(([k, v]) => `${property}-${k}:${presetToCss(v)}`).join(';');
  return { sides: Object.fromEntries(entries), css };
}

type SpacingResult = { attrs: Record<string, unknown>; css: string };

/**
 * cssは未エスケープの生CSS文字列。style属性へ埋め込む際は、他のCSSと
 * 連結してから呼び出し側でescapeAttr()を1回通すこと。
 */
export function buildSpacing(props: Record<string, any>): SpacingResult {
  const styleParts: string[] = [];
  const spacing: Record<string, unknown> = {};

  if (props.padding) {
    const { sides, css } = resolveSpacing('padding', props.padding);
    spacing.padding = sides;
    styleParts.push(css);
  }
  if (props.margin) {
    const { sides, css } = resolveSpacing('margin', props.margin);
    spacing.margin = sides;
    styleParts.push(css);
  }
  if (props.blockGap) {
    spacing.blockGap = props.blockGap;
    styleParts.push(`gap:${presetToCss(props.blockGap)}`);
  }

  const attrs = Object.keys(spacing).length > 0 ? { style: { spacing } } : {};
  return { attrs, css: styleParts.filter(Boolean).join(';') };
}
