import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_LINK = '__wp_link__';

export type WpLinkProps = WithChildren & WithClassName & {
  href: string;
};

export function WpLink(props: WpLinkProps) {
  return React.createElement(WP_LINK as any, props, props.children);
}
