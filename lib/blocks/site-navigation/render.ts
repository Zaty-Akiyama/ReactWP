import React from 'react';

import type {
  OriginalBlockRenderer,
} from '../types.js';

import {
  WP_SITE_NAVIGATION_ICON,
  WP_SITE_NAVIGATION_ITEM,
  WpSiteNavigationIcon,
  WpSiteNavigationItem,
} from './component.js';

type NavigationItem = {
  label: string;
  href: string;
  className?: string;
  target?: '_self' | '_blank';
  rel?: string;
};

function isSiteNavigationIcon(
  type: unknown,
): boolean {
  return (
    type === WpSiteNavigationIcon ||
    type === WP_SITE_NAVIGATION_ICON
  );
}

function isSiteNavigationItem(
  type: unknown,
): boolean {
  return (
    type === WpSiteNavigationItem ||
    type === WP_SITE_NAVIGATION_ITEM
  );
}

export const renderSiteNavigation:
OriginalBlockRenderer = (
  props,
  context,
) => {
  const attrs: Record<string, unknown> = {};
  const items: NavigationItem[] = [];

  if (typeof props.className === 'string') {
    attrs.className = props.className;
  }

  if (typeof props.menuLocation === 'string') {
    attrs.menuLocation = props.menuLocation;
  }

  if (typeof props.ariaLabel === 'string') {
    attrs.ariaLabel = props.ariaLabel;
  }

  if (typeof props.toggleLabel === 'string') {
    attrs.toggleLabel = props.toggleLabel;
  }

  if (typeof props.closeLabel === 'string') {
    attrs.closeLabel = props.closeLabel;
  }

  let iconHtml = '';

  for (
    const child of React.Children.toArray(
      props.children,
    )
  ) {
    if (!React.isValidElement(child)) {
      continue;
    }

    const childProps =
      child.props as Record<string, unknown>;

    if (isSiteNavigationIcon(child.type)) {
      if (iconHtml !== '') {
        throw new Error(
          'WpSiteNavigationIconは1つだけ指定できます。',
        );
      }

      const classes = [
        'site-navigation__icon',
        typeof childProps.className === 'string'
          ? childProps.className
          : '',
      ]
        .filter(Boolean)
        .join(' ');

      iconHtml = [
        `<span class="${context.escapeAttr(classes)}"`,
        ' aria-hidden="true">',
        context.renderNode(
          childProps.children as React.ReactNode,
        ),
        '</span>',
      ].join('');

      continue;
    }

    if (isSiteNavigationItem(child.type)) {
      const label =
        typeof childProps.label === 'string'
          ? childProps.label
          : '';

      const href =
        typeof childProps.href === 'string'
          ? childProps.href
          : '';

      if (!label || !href) {
        throw new Error(
          'WpSiteNavigationItemにはlabelとhrefが必要です。',
        );
      }

      items.push({
        label,
        href,
        ...(typeof childProps.className === 'string'
          ? { className: childProps.className }
          : {}),
        ...(childProps.target === '_self' ||
        childProps.target === '_blank'
          ? { target: childProps.target }
          : {}),
        ...(typeof childProps.rel === 'string'
          ? { rel: childProps.rel }
          : {}),
      });

      continue;
    }

    throw new Error(
      'WpSiteNavigation直下には' +
      'WpSiteNavigationIconまたは' +
      'WpSiteNavigationItemだけを配置できます。',
    );
  }

  if (iconHtml) {
    attrs.iconHtml = iconHtml;
  }

  if (items.length > 0) {
    attrs.items = items;
  }

  const serialized =
    context.serializeAttrs(attrs);

  return serialized
    ? `<!-- wp:reactwp/site-navigation ${serialized} /-->`
    : '<!-- wp:reactwp/site-navigation /-->';
};