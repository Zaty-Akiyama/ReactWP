import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_BUTTON = '__wp_button__';

export type WpButtonProps = WithChildren & WithClassName & {
  href: string;
};

export function WpButton(props: WpButtonProps) {
  return React.createElement(WP_BUTTON as any, props, props.children);
}
