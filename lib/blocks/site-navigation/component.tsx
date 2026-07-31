import React from 'react';

export const WP_SITE_NAVIGATION =
  '__wp_site_navigation__';

export const WP_SITE_NAVIGATION_ICON =
  '__wp_site_navigation_icon__';

export const WP_SITE_NAVIGATION_ITEM =
  '__wp_site_navigation_item__';

export const WP_SITE_NAVIGATION_LIST =
  '__wp_site_navigation_list__';

export type WpSiteNavigationProps = {
  children?: React.ReactNode;
  className?: string;
  menuLocation?: string;
  ariaLabel?: string;
  toggleLabel?: string;
  closeLabel?: string;
};

export type WpSiteNavigationIconProps = {
  children?: React.ReactNode;
  className?: string;
};

export type WpSiteNavigationListProps = {
  children?: React.ReactNode;
  className?: string;
};

export function WpSiteNavigationList(
  props: WpSiteNavigationListProps,
) {
  return React.createElement(
    WP_SITE_NAVIGATION_LIST as any,
    props,
    props.children,
  );
}

export type WpSiteNavigationItemProps = {
  label: string;
  href: string;
  className?: string;
  linkClassName?: string;
  target?: '_self' | '_blank';
  rel?: string;
};

export function WpSiteNavigation(
  props: WpSiteNavigationProps,
) {
  return React.createElement(
    WP_SITE_NAVIGATION as any,
    props,
    props.children,
  );
}

export function WpSiteNavigationIcon(
  props: WpSiteNavigationIconProps,
) {
  return React.createElement(
    WP_SITE_NAVIGATION_ICON as any,
    props,
    props.children,
  );
}

export function WpSiteNavigationItem(
  props: WpSiteNavigationItemProps,
) {
  return React.createElement(
    WP_SITE_NAVIGATION_ITEM as any,
    props,
  );
}