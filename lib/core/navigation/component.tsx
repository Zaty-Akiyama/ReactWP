import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_NAVIGATION = '__wp_navigation__';
export const WP_NAVIGATION_LINK = '__wp_navigation_link__';

export type WpNavigationProps = WithChildren &
  WithClassName & {
    overlayMenu?: 'never' | 'mobile' | 'always';
    orientation?: 'horizontal' | 'vertical';
    justifyContent?: 'left' | 'center' | 'right' | 'space-between';
  };

export type WpNavigationLinkProps = WithClassName & {
  label: string;
  url: string;
  kind?: 'custom' | 'post-type' | 'taxonomy';
  opensInNewTab?: boolean;
  rel?: string;
};

export function WpNavigation(props: WpNavigationProps) {
  return React.createElement(
    WP_NAVIGATION as any,
    props,
    props.children,
  );
}

export function WpNavigationLink(props: WpNavigationLinkProps) {
  return React.createElement(
    WP_NAVIGATION_LINK as any,
    props,
  );
}
