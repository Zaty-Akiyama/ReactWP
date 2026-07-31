import type { CoreBlockRenderer } from '../types.js';

export const renderButton: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const divClasses = ['wp-block-button', props.className].filter(Boolean).join(' ');
  const href = context.escapeAttr(props.href ?? '#');
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('button', attrs),
    `<div class="${context.escapeAttr(divClasses)}"><a class="wp-block-button__link wp-element-button" href="${href}">${inner}</a></div>`,
    context.closeBlockComment('button'),
  ].join('\n');
};
