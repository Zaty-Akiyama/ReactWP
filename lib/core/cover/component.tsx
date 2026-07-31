import React from 'react';
import type { WithChildren, WithClassName, SpacingProps, WithBlockGap } from '../types.js';

export const WP_COVER = '__wp_cover__';

export type WpCoverProps = WithChildren &
  WithClassName &
  SpacingProps &
  WithBlockGap & {
    url?: string;
    id?: number;
    alt?: string;
    dimRatio?: number;
  };

export function WpCover(props: WpCoverProps) {
  return React.createElement(WP_COVER as any, props, props.children);
}
