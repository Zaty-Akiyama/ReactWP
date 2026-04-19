import React from 'react';

export const WP_GROUP = '__wp_group__';
export const WP_HEADING = '__wp_heading__';
export const WP_PARAGRAPH = '__wp_paragraph__';
export const WP_LINK = '__wp_link__';
export const WP_BUTTONS = '__wp_buttons__';
export const WP_BUTTON = '__wp_button__';
export const WP_COLUMNS = '__wp_columns__';
export const WP_COLUMN = '__wp_column__';
export const WP_IMAGE = '__wp_image__';
export const WP_LIST = '__wp_list__';
export const WP_LIST_ITEM = '__wp_list_item__';
export const WP_SEPARATOR = '__wp_separator__';
export const WP_SPACER = '__wp_spacer__';

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

export function WpButtons(props: any) {
  return React.createElement(WP_BUTTONS, props, props.children);
}

export function WpButton(props: any) {
  return React.createElement(WP_BUTTON, props, props.children);
}

export function WpColumns(props: any) {
  return React.createElement(WP_COLUMNS, props, props.children);
}

export function WpColumn(props: any) {
  return React.createElement(WP_COLUMN, props, props.children);
}

export function WpImage(props: any) {
  return React.createElement(WP_IMAGE, props);
}

export function WpList(props: any) {
  return React.createElement(WP_LIST, props, props.children);
}

export function WpListItem(props: any) {
  return React.createElement(WP_LIST_ITEM, props, props.children);
}

export function WpSeparator(props: any = {}) {
  return React.createElement(WP_SEPARATOR, props);
}

export function WpSpacer(props: any) {
  return React.createElement(WP_SPACER, props);
}