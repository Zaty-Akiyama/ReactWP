import type { CoreBlockRenderer } from '../types.js';

export const renderColumn: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.width) attrs.width = props.width;
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, styleAttr: spacingStyle } = context.buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const classes = ['wp-block-column', props.className].filter(Boolean).join(' ');
  const flexStyle = props.width ? `flex-basis:${context.escapeAttr(props.width)}` : '';
  const spacingCss = spacingStyle ? spacingStyle.slice(8, -1) : '';
  const combinedStyle = [flexStyle, spacingCss].filter(Boolean).join(';');
  const styleAttr = combinedStyle ? ` style="${combinedStyle}"` : '';

  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('column', attrs),
    `<div class="${context.escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    context.closeBlockComment('column'),
  ].join('\n');
};
