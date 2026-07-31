import type { CoreBlockRenderer } from '../types.js';

export const renderHeading: CoreBlockRenderer = (props, context) => {
  const level = props.level ?? 2;
  const attrs: Record<string, unknown> = {};

  if (props.level) attrs.level = props.level;
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${context.escapeAttr(props.className)}"` : '';
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('heading', attrs),
    `<h${level}${classAttr}>${inner}</h${level}>`,
    context.closeBlockComment('heading'),
  ].join('\n');
};
