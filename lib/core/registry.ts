import type {
  CoreBlockProps,
  CoreBlockRenderContext,
  CoreBlockRenderer,
} from './types.js';

import { WP_GROUP, renderGroup } from './group/index.js';
import { WP_HEADING, renderHeading } from './heading/index.js';
import { WP_PARAGRAPH, renderParagraph } from './paragraph/index.js';
import { WP_LINK, renderLink } from './link/index.js';
import { WP_BUTTONS, renderButtons } from './buttons/index.js';
import { WP_BUTTON, renderButton } from './button/index.js';
import { WP_COLUMNS, renderColumns } from './columns/index.js';
import { WP_COLUMN, renderColumn } from './column/index.js';
import { WP_IMAGE, renderImage } from './image/index.js';
import { WP_LIST, renderList } from './list/index.js';
import { WP_LIST_ITEM, renderListItem } from './list-item/index.js';
import { WP_SEPARATOR, renderSeparator } from './separator/index.js';
import { WP_SPACER, renderSpacer } from './spacer/index.js';
import { WP_COVER, renderCover } from './cover/index.js';
import {
  WP_NAVIGATION,
  WP_NAVIGATION_LINK,
  renderNavigation,
  renderNavigationLink,
} from './navigation/index.js';
import { WP_HTML, renderHtml } from './html/index.js';
import { WP_SHORTCODE, renderShortcode } from './shortcode/index.js';
import { WP_POST_TITLE, renderPostTitle } from './post-title/index.js';
import { WP_POST_EXCERPT, renderPostExcerpt } from './post-excerpt/index.js';
import { WP_QUERY, renderQuery } from './query/index.js';
import { WP_POST_TEMPLATE, renderPostTemplate } from './post-template/index.js';
import { WP_ELEMENT, renderElement } from './element/index.js';

const renderers = new Map<string, CoreBlockRenderer>([
  [WP_GROUP, renderGroup],
  [WP_HEADING, renderHeading],
  [WP_PARAGRAPH, renderParagraph],
  [WP_LINK, renderLink],
  [WP_BUTTONS, renderButtons],
  [WP_BUTTON, renderButton],
  [WP_COLUMNS, renderColumns],
  [WP_COLUMN, renderColumn],
  [WP_IMAGE, renderImage],
  [WP_LIST, renderList],
  [WP_LIST_ITEM, renderListItem],
  [WP_SEPARATOR, renderSeparator],
  [WP_SPACER, renderSpacer],
  [WP_COVER, renderCover],
  [WP_NAVIGATION, renderNavigation],
  [WP_NAVIGATION_LINK, renderNavigationLink],
  [WP_HTML, renderHtml],
  [WP_SHORTCODE, renderShortcode],
  [WP_POST_TITLE, renderPostTitle],
  [WP_POST_EXCERPT, renderPostExcerpt],
  [WP_QUERY, renderQuery],
  [WP_POST_TEMPLATE, renderPostTemplate],
  [WP_ELEMENT, renderElement],
]);

export function renderCoreBlock(
  type: string,
  props: CoreBlockProps,
  context: CoreBlockRenderContext,
): string | null {
  const renderer = renderers.get(type);

  if (!renderer) {
    return null;
  }

  return renderer(props, context);
}
