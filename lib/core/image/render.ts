import type { CoreBlockRenderer } from '../types.js';

export const renderImage: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.sizeSlug) attrs.sizeSlug = props.sizeSlug;
  if (props.className) attrs.className = props.className;

  const resolvedSrc = context.resolveUrl(props.src ?? '');

  const sizeClass = props.sizeSlug ? `size-${props.sizeSlug}` : '';
  const classes = ['wp-block-image', sizeClass, props.className].filter(Boolean).join(' ');
  const src = resolvedSrc.htmlValue;
  const alt = context.escapeAttr(props.alt ?? '');
  const dataAttrs = context.buildDataAttrs(props, context.escapeAttr);

  return [
    context.openBlockComment('image', attrs),
    `<figure class="${context.escapeAttr(classes)}"><img src="${src}" alt="${alt}"${dataAttrs}/></figure>`,
    context.closeBlockComment('image'),
  ].join('\n');
};
