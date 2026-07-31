import React from 'react';

export const WP_SHORTCODE = '__wp_shortcode__';

export type WpShortcodeProps = {
  children: string;
};

export function WpShortcode(props: WpShortcodeProps) {
  return React.createElement(
    WP_SHORTCODE as any,
    {},
    props.children,
  );
}
