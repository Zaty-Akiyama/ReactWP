import type { CoreBlockRenderer } from '../types.js';

export const renderColumn: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.width) attrs.width = props.width;
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, css: spacingCss } = context.buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const classes = ['wp-block-column', props.className].filter(Boolean).join(' ');
  const flexStyle = props.width ? `flex-basis:${props.width}` : '';
  const combinedCss = [flexStyle, spacingCss].filter(Boolean).join(';');
  const styleAttr = combinedCss ? ` style="${context.escapeAttr(combinedCss)}"` : '';

  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('column', attrs),
    `<div class="${context.escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    context.closeBlockComment('column'),
  ].join('\n');
};
