import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_LIST = '__wp_list__';

export type WpListProps = WithChildren & WithClassName & {
  ordered?: boolean;
};

export function WpList(props: WpListProps) {
  return React.createElement(WP_LIST as any, props, props.children);
}
