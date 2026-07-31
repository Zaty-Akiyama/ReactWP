import type { CoreBlockRenderer } from '../types.js';

export const renderColumns: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, css: spacingCss } = context.buildSpacing(props);
  Object.assign(attrs, spacingAttrs);
  const styleAttr = spacingCss ? ` style="${context.escapeAttr(spacingCss)}"` : '';

  const classes = ['wp-block-columns', props.className].filter(Boolean).join(' ');
  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('columns', attrs),
    `<div class="${context.escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    context.closeBlockComment('columns'),
  ].join('\n');
};
