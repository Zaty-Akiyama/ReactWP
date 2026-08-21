import React from 'react';
import type { WithChildren, WithClassName, SpacingProps, WithBlockGap } from '../types.js';

export const WP_GROUP = '__wp_group__';

export type WpGroupTagName =
  | 'div'
  | 'section'
  | 'article'
  | 'main'
  | 'header'
  | 'footer'
  | 'aside'
  | 'nav';

export type WpGroupLayout = {
  type: 'constrained';
  contentSize?: string;
  wideSize?: string;
};

export type WpGroupProps = WithChildren & WithClassName & SpacingProps & WithBlockGap & {
  tagName?: WpGroupTagName;
  layout?: WpGroupLayout;
};

export function WpGroup(props: WpGroupProps) {
  return React.createElement(WP_GROUP as any, props, props.children);
}
