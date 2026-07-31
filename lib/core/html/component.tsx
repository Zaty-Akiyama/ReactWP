import React from 'react';

export const WP_HTML = '__wp_html__';

export type WpHtmlProps = {
  children?: React.ReactNode;
};

export function WpHtml(props: WpHtmlProps) {
  return React.createElement(
    WP_HTML as any,
    {},
    props.children,
  );
}
