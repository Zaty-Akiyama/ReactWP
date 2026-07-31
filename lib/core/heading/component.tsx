import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_HEADING = '__wp_heading__';

export type WpHeadingProps = WithChildren & WithClassName & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function WpHeading(props: WpHeadingProps) {
  return React.createElement(WP_HEADING as any, props, props.children);
}
