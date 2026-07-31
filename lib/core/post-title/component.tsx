import React from 'react';
import type { WithClassName } from '../types.js';

export const WP_POST_TITLE = '__wp_post_title__';

export type WpPostTitleProps = WithClassName & {
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isLink?: boolean;
  rel?: string;
  linkTarget?: '_self' | '_blank';
  textAlign?: 'left' | 'center' | 'right';
};

export function WpPostTitle(props: WpPostTitleProps = {}) {
  return React.createElement(WP_POST_TITLE as any, props);
}
