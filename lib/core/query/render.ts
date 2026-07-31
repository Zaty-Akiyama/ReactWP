import type { CoreBlockRenderer } from '../types.js';

const QUERY_KEYS = [
  'postType',
  'perPage',
  'pages',
  'offset',
  'order',
  'orderBy',
  'author',
  'search',
  'exclude',
  'sticky',
  'inherit',
  'taxQuery',
  'parents',
] as const;

export const renderQuery: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  const query: Record<string, unknown> = {};

  for (const key of QUERY_KEYS) {
    if (props[key] !== undefined) {
      query[key] = props[key];
    }
  }

  if (Object.keys(query).length > 0) {
    attrs.query = query;
  }

  if (props.queryId !== undefined) attrs.queryId = props.queryId;
  if (props.tagName && props.tagName !== 'div') attrs.tagName = props.tagName;
  if (props.className) attrs.className = props.className;

  const tagName = props.tagName ?? 'div';
  const classes = ['wp-block-query', props.className].filter(Boolean).join(' ');
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('query', attrs),
    `<${tagName} class="${context.escapeAttr(classes)}">`,
    inner,
    `</${tagName}>`,
    context.closeBlockComment('query'),
  ].join('\n');
};
