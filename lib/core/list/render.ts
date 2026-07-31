import type { CoreBlockRenderer } from '../types.js';

export const renderList: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.ordered) attrs.ordered = true;
  if (props.className) attrs.className = props.className;

  const tag = props.ordered ? 'ol' : 'ul';
  const classes = ['wp-block-list', props.className].filter(Boolean).join(' ');
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('list', attrs),
    `<${tag} class="${context.escapeAttr(classes)}">`,
    inner,
    `</${tag}>`,
    context.closeBlockComment('list'),
  ].join('\n');
};
