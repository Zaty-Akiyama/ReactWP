import type { CoreBlockRenderer } from '../types.js';

const VOID_ELEMENTS = new Set([
  'input', 'br', 'hr', 'img', 'meta', 'link',
  'area', 'base', 'col', 'embed', 'source', 'track', 'wbr',
]);

const ATTRIBUTE_NAME_MAP: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  tabIndex: 'tabindex',
  readOnly: 'readonly',
  maxLength: 'maxlength',
  minLength: 'minlength',
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  noValidate: 'novalidate',
  spellCheck: 'spellcheck',
};

/**
 * true/falseを属性の有無で表現するネイティブHTML属性。
 * これ以外(aria-*等)はtrue/falseを文字列"true"/"false"として出力する。
 */
const NATIVE_BOOLEAN_ATTRIBUTES = new Set([
  'required', 'disabled', 'checked', 'hidden', 'novalidate', 'readonly',
  'autofocus', 'multiple', 'selected', 'open', 'inert', 'defer', 'async', 'reversed',
]);

const SKIP_KEYS = new Set(['as', 'children']);

export const renderElement: CoreBlockRenderer = (props, context) => {
  const tagName = typeof props.as === 'string' && props.as !== '' ? props.as : 'div';
  const dataAttrs = context.buildDataAttrs(props, context.escapeAttr);

  const otherAttrs = Object.entries(props)
    .filter(([key, value]) => {
      if (SKIP_KEYS.has(key)) return false;
      if (/^data[A-Z]/.test(key)) return false;
      return value !== undefined && value !== null && value !== false;
    })
    .map(([key, value]) => {
      const attrName = key.includes('-')
        ? key
        : (ATTRIBUTE_NAME_MAP[key] ?? key.toLowerCase());

      if (value === true) {
        return NATIVE_BOOLEAN_ATTRIBUTES.has(attrName)
          ? ` ${attrName}`
          : ` ${attrName}="true"`;
      }

      return ` ${attrName}="${context.escapeAttr(String(value))}"`;
    })
    .join('');

  if (VOID_ELEMENTS.has(tagName)) {
    return `<${tagName}${otherAttrs}${dataAttrs} />`;
  }

  const inner = context.renderNode(props.children);
  return `<${tagName}${otherAttrs}${dataAttrs}>${inner}</${tagName}>`;
};
