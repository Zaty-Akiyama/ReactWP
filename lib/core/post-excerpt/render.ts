import type { CoreBlockRenderer } from '../types.js';

export const renderPostExcerpt: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};

  if (props.moreText) attrs.moreText = props.moreText;
  if (props.showMoreOnNewLine !== undefined) attrs.showMoreOnNewLine = props.showMoreOnNewLine;
  if (props.excerptLength !== undefined) attrs.excerptLength = props.excerptLength;
  if (props.textAlign) attrs.textAlign = props.textAlign;
  if (props.className) attrs.className = props.className;

  return context.selfClosingBlockComment('post-excerpt', attrs);
};
