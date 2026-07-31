import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_LIST_ITEM = '__wp_list_item__';

export type WpListItemProps = WithChildren & WithClassName;

export function WpListItem(props: WpListItemProps) {
  return React.createElement(WP_LIST_ITEM as any, props, props.children);
}
