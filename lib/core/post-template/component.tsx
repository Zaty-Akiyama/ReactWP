import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_POST_TEMPLATE = '__wp_post_template__';

export type WpPostTemplateProps = WithChildren & WithClassName;

export function WpPostTemplate(props: WpPostTemplateProps) {
  return React.createElement(WP_POST_TEMPLATE as any, props, props.children);
}
