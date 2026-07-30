import type {
  OriginalBlockProps,
  OriginalBlockRenderContext,
  OriginalBlockRenderer,
} from './types.js';

import {
  WP_SITE_NAVIGATION,
  WP_SITE_NAVIGATION_ICON,
  WP_SITE_NAVIGATION_ITEM,
  renderSiteNavigation,
} from './site-navigation/index.js';

const nestedOnlyRenderer = (
  blockName: string,
): OriginalBlockRenderer => {
  return () => {
    throw new Error(
      `${blockName}はWpSiteNavigationの子として使用してください。`,
    );
  };
};

const renderers =
  new Map<string, OriginalBlockRenderer>([
    [
      WP_SITE_NAVIGATION,
      renderSiteNavigation,
    ],
    [
      WP_SITE_NAVIGATION_ICON,
      nestedOnlyRenderer(
        'WpSiteNavigationIcon',
      ),
    ],
    [
      WP_SITE_NAVIGATION_ITEM,
      nestedOnlyRenderer(
        'WpSiteNavigationItem',
      ),
    ],
  ]);

export function renderOriginalBlock(
  type: string,
  props: OriginalBlockProps,
  context: OriginalBlockRenderContext,
): string | null {
  const renderer = renderers.get(type);

  if (!renderer) {
    return null;
  }

  return renderer(props, context);
}