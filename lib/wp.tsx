import React from 'react';

export const WP_GROUP = '__wp_group__';
export const WP_HEADING = '__wp_heading__';
export const WP_PARAGRAPH = '__wp_paragraph__';
export const WP_LINK = '__wp_link__';

export type PatternMeta = {
  title: string;
  slug: string;
  categories?: string[];
  description?: string;
};

export function WpGroup(props: any) {
  return React.createElement(WP_GROUP, props, props.children);
}

export function WpHeading(props: any) {
  return React.createElement(WP_HEADING, props, props.children);
}

export function WpParagraph(props: any) {
  return React.createElement(WP_PARAGRAPH, props, props.children);
}

export function WpLink(props: any) {
  return React.createElement(WP_LINK, props, props.children);
}