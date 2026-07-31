import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_PARAGRAPH = '__wp_paragraph__';

export type WpParagraphProps = WithChildren & WithClassName;

export function WpParagraph(props: WpParagraphProps) {
  return React.createElement(WP_PARAGRAPH as any, props, props.children);
}
