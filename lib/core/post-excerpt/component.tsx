import React from 'react';
import type { WithClassName } from '../types.js';

export const WP_POST_EXCERPT = '__wp_post_excerpt__';

export type WpPostExcerptProps = WithClassName & {
  moreText?: string;
  showMoreOnNewLine?: boolean;
  excerptLength?: number;
  textAlign?: 'left' | 'center' | 'right';
};

export function WpPostExcerpt(props: WpPostExcerptProps = {}) {
  return React.createElement(WP_POST_EXCERPT as any, props);
}
