import React from 'react';
import type { WithChildren, WithClassName, SpacingProps } from '../types.js';

export const WP_BUTTONS = '__wp_buttons__';

export type WpButtonsProps = WithChildren & WithClassName & SpacingProps;

export function WpButtons(props: WpButtonsProps) {
  return React.createElement(WP_BUTTONS as any, props, props.children);
}
