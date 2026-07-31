import React from 'react';
import type { WithClassName } from '../types.js';

export const WP_SEPARATOR = '__wp_separator__';

export type WpSeparatorProps = WithClassName;

export function WpSeparator(props: WpSeparatorProps = {}) {
  return React.createElement(WP_SEPARATOR as any, props);
}
