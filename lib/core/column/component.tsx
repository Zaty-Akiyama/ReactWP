import React from 'react';
import type { WithChildren, WithClassName, SpacingProps } from '../types.js';

export const WP_COLUMN = '__wp_column__';

export type WpColumnProps = WithChildren & WithClassName & SpacingProps & {
  width?: string;
};

export function WpColumn(props: WpColumnProps) {
  return React.createElement(WP_COLUMN as any, props, props.children);
}
