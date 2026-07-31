import type { CoreBlockRenderer } from '../types.js';

export const renderLink: CoreBlockRenderer = (props, context) => {
  const href = context.escapeAttr(props.href);
  const classAttr = props.className ? ` class="${context.escapeAttr(props.className)}"` : '';
  const inner = context.renderNode(props.children);

  return `<a href="${href}"${classAttr}>${inner}</a>`;
};
