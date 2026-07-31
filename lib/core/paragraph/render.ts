import type { CoreBlockRenderer } from '../types.js';

export const renderParagraph: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${context.escapeAttr(props.className)}"` : '';
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('paragraph', attrs),
    `<p${classAttr}>${inner}</p>`,
    context.closeBlockComment('paragraph'),
  ].join('\n');
};
