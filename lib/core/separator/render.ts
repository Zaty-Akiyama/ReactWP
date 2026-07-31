import type { CoreBlockRenderer } from '../types.js';

export const renderSeparator: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classes = ['wp-block-separator has-alpha-channel-opacity', props.className]
    .filter(Boolean).join(' ');

  return [
    context.openBlockComment('separator', attrs),
    `<hr class="${context.escapeAttr(classes)}"/>`,
    context.closeBlockComment('separator'),
  ].join('\n');
};
