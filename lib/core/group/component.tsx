import React from 'react';
import type { WithChildren, WithClassName, SpacingProps, WithBlockGap } from '../types.js';

export const WP_GROUP = '__wp_group__';

export type WpGroupProps = WithChildren & WithClassName & SpacingProps & WithBlockGap & {
  tagName?: string;
};

export function WpGroup(props: WpGroupProps) {
  return React.createElement(WP_GROUP as any, props, props.children);
}
