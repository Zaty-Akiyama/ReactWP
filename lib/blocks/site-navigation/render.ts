import React from 'react';

import type {
  OriginalBlockRenderer,
} from '../types.js';

import {
  WP_SITE_NAVIGATION_ICON,
  WP_SITE_NAVIGATION_LIST,
  WP_SITE_NAVIGATION_ITEM,
  WpSiteNavigationIcon,
  WpSiteNavigationList,
  WpSiteNavigationItem,
} from './component.js';

type NavigationItem = {
  label: string;
  href: string;
  className?: string;
  linkClassName?: string;
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

function isSiteNavigationList(
  type: unknown,
): boolean {
  return (
    type === WpSiteNavigationList ||
    type === WP_SITE_NAVIGATION_LIST
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
  let listClassName = '';
  let hasList = false;

  /**
   * WpSiteNavigationItemをitems属性へ追加する。
   */
  const appendNavigationItem = (
    child: React.ReactElement,
  ): void => {
    const childProps =
      child.props as Record<string, unknown>;

    const label =
      typeof childProps.label === 'string'
        ? childProps.label
        : '';

    const href =
      typeof childProps.href === 'string'
        ? childProps.href
        : '';

    if (label === '' || href === '') {
      throw new Error(
        'WpSiteNavigationItemにはlabelとhrefが必要です。',
      );
    }

    items.push({
      label,
      href,
      ...(typeof childProps.className === 'string'
        ? {
            className: childProps.className,
          }
        : {}),
      ...(typeof childProps.linkClassName === 'string'
        ? {
            linkClassName: childProps.linkClassName,
          }
        : {}),
      ...(childProps.target === '_self' ||
      childProps.target === '_blank'
        ? {
            target: childProps.target,
          }
        : {}),
      ...(typeof childProps.rel === 'string'
        ? {
            rel: childProps.rel,
          }
        : {}),
    });
  };

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

    /**
     * アイコン
     */
    if (isSiteNavigationIcon(child.type)) {
      if (iconHtml !== '') {
        throw new Error(
          'WpSiteNavigationIconは1つだけ指定できます。',
        );
      }

      const classes = [
        'reactwp-site-navigation__icon',
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

    /**
     * リスト
     */
    if (isSiteNavigationList(child.type)) {
      if (hasList) {
        throw new Error(
          'WpSiteNavigationListは1つだけ指定できます。',
        );
      }

      hasList = true;

      if (typeof childProps.className === 'string') {
        listClassName = childProps.className;
      }

      for (
        const listChild of React.Children.toArray(
          childProps.children as React.ReactNode,
        )
      ) {
        if (!React.isValidElement(listChild)) {
          continue;
        }

        if (!isSiteNavigationItem(listChild.type)) {
          const childName =
            typeof listChild.type === 'function'
              ? listChild.type.name
              : String(listChild.type);

          throw new Error(
            'WpSiteNavigationList直下には' +
            'WpSiteNavigationItemだけを配置できます。' +
            ` 使用された要素: ${childName}`,
          );
        }

        appendNavigationItem(listChild);
      }

      continue;
    }

    /**
     * 後方互換のため、ListなしのItemも許可する。
     */
    if (isSiteNavigationItem(child.type)) {
      appendNavigationItem(child);
      continue;
    }

    const childName =
      typeof child.type === 'function'
        ? child.type.name
        : String(child.type);

    throw new Error(
      'WpSiteNavigation直下には' +
      'WpSiteNavigationIcon、' +
      'WpSiteNavigationList、' +
      'WpSiteNavigationItemだけを配置できます。' +
      ` 使用された要素: ${childName}`,
    );
  }

  if (iconHtml !== '') {
    attrs.iconHtml = iconHtml;
  }

  if (listClassName !== '') {
    attrs.listClassName = listClassName;
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