import type { CoreBlockRenderer } from '../types.js';

export const renderSpacer: CoreBlockRenderer = (props, context) => {
  const height: string = props.height ?? '40px';

  return [
    context.openBlockComment('spacer', { height }),
    `<div style="height:${context.escapeAttr(height)}" aria-hidden="true" class="wp-block-spacer"></div>`,
    context.closeBlockComment('spacer'),
  ].join('\n');
};
