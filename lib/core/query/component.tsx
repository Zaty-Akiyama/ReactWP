import React from 'react';
import type { WithChildren, WithClassName } from '../types.js';

export const WP_QUERY = '__wp_query__';

export type WpQueryTagName = 'div' | 'section' | 'aside' | 'main';

export type WpQueryProps = WithChildren & WithClassName & {
  queryId?: number;
  postType?: string;
  perPage?: number;
  pages?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'date' | 'title' | 'menu_order' | 'popular' | 'rand';
  author?: string;
  search?: string;
  exclude?: number[];
  sticky?: '' | 'exclude' | 'only';
  inherit?: boolean;
  taxQuery?: Record<string, number[]>;
  parents?: number[];
  tagName?: WpQueryTagName;
};

export function WpQuery(props: WpQueryProps) {
  return React.createElement(WP_QUERY as any, props, props.children);
}
