import type { CoreBlockRenderer } from '../types.js';

export const renderPostTemplate: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  return [
    context.openBlockComment('post-template', attrs),
    context.renderNode(props.children),
    context.closeBlockComment('post-template'),
  ].join('\n');
};
