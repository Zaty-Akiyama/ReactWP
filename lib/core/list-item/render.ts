import type { CoreBlockRenderer } from '../types.js';

export const renderListItem: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${context.escapeAttr(props.className)}"` : '';
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('list-item', attrs),
    `<li${classAttr}>${inner}</li>`,
    context.closeBlockComment('list-item'),
  ].join('\n');
};
