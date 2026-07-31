import type { CoreBlockRenderer } from '../types.js';

export const renderShortcode: CoreBlockRenderer = (props) => {
  if (typeof props.children !== 'string') {
    throw new Error('WpShortcode children must be a string.');
  }

  return [
    '<!-- wp:shortcode -->',
    props.children,
    '<!-- /wp:shortcode -->',
  ].join('\n');
};
