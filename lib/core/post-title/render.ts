import type { CoreBlockRenderer } from '../types.js';

export const renderPostTitle: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};

  if (props.level !== undefined) attrs.level = props.level;
  if (props.isLink) attrs.isLink = props.isLink;
  if (props.rel) attrs.rel = props.rel;
  if (props.linkTarget) attrs.linkTarget = props.linkTarget;
  if (props.textAlign) attrs.textAlign = props.textAlign;
  if (props.className) attrs.className = props.className;

  return context.selfClosingBlockComment('post-title', attrs);
};
