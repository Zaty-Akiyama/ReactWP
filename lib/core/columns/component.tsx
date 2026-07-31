import React from 'react';
import type { WithChildren, WithClassName, SpacingProps, WithBlockGap } from '../types.js';

export const WP_COLUMNS = '__wp_columns__';

export type WpColumnsProps = WithChildren & WithClassName & SpacingProps & WithBlockGap;

export function WpColumns(props: WpColumnsProps) {
  return React.createElement(WP_COLUMNS as any, props, props.children);
}
