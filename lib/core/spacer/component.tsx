import React from 'react';

export const WP_SPACER = '__wp_spacer__';

export type WpSpacerProps = {
  height?: string;
};

export function WpSpacer(props: WpSpacerProps) {
  return React.createElement(WP_SPACER as any, props);
}
