import type { CoreBlockRenderer } from '../types.js';

export const renderHtml: CoreBlockRenderer = (props, context) => {
  const content = context.renderNode(props.children);

  return [
    '<!-- wp:html -->',
    content,
    '<!-- /wp:html -->',
  ].join('\n');
};
