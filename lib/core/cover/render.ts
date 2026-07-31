import type { CoreBlockRenderer } from '../types.js';

export const renderCover: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};

  const resolvedUrl = props.url
    ? context.resolveUrl(props.url)
    : null;

  if (resolvedUrl) {
    attrs.url = resolvedUrl.blockValue;
  }

  if (props.id !== undefined) {
    attrs.id = props.id;
  }

  if (props.alt) {
    attrs.alt = props.alt;
  }

  if (props.dimRatio !== undefined) {
    attrs.dimRatio = props.dimRatio;
  }

  if (props.className) {
    attrs.className = props.className;
  }

  const dimRatio = props.dimRatio ?? 60;

  const classes = [
    'wp-block-cover',
    props.className,
  ]
    .filter(Boolean)
    .join(' ');

  const image = resolvedUrl
    ? [
        '<img',
        ' class="wp-block-cover__image-background"',
        ` alt="${context.escapeAttr(props.alt ?? '')}"`,
        ` src="${resolvedUrl.htmlValue}"`,
        ' data-object-fit="cover"',
        ' />',
      ].join('')
    : '';

  const overlay = [
    '<span',
    ' aria-hidden="true"',
    ` class="wp-block-cover__background has-background-dim-${dimRatio} has-background-dim"`,
    '></span>',
  ].join('');

  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('cover', attrs),
    `<div class="${context.escapeAttr(classes)}">`,
    image,
    overlay,
    '<div class="wp-block-cover__inner-container">',
    inner,
    '</div>',
    '</div>',
    context.closeBlockComment('cover'),
  ].join('\n');
};
