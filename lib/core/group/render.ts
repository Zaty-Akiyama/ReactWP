import type { CoreBlockRenderer } from '../types.js';

export const renderGroup: CoreBlockRenderer = (props, context) => {
  const tagName = props.tagName ?? 'div';
  const attrs: Record<string, unknown> = {};

  if (props.tagName) attrs.tagName = props.tagName;
  if (props.className) attrs.className = props.className;
  if (props.layout) attrs.layout = props.layout;

  const classes = ['wp-block-group', props.className].filter(Boolean).join(' ');
  const classAttr = classes ? ` class="${context.escapeAttr(classes)}"` : '';

  const { attrs: spacingAttrs, css: spacingCss } = context.buildSpacing(props);
  Object.assign(attrs, spacingAttrs);
  const styleAttr = spacingCss ? ` style="${context.escapeAttr(spacingCss)}"` : '';
  const dataAttrs = context.buildDataAttrs(props, context.escapeAttr);

  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('group', attrs),
    `<${tagName}${classAttr}${styleAttr}${dataAttrs}>`,
    inner,
    `</${tagName}>`,
    context.closeBlockComment('group'),
  ].join('\n');
};
