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

export function wpSpacing(size: number | string): string {
  return `var:preset|spacing|${size}`;
}

export type PatternMeta = {
  title: string;
  slug: string;
  categories?: string[];
  description?: string;
};

type WithChildren = { children?: React.ReactNode };
type WithClassName = { className?: string };

type SpacingSides = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

type SpacingProps = {
  padding?: string | SpacingSides;
  margin?: string | SpacingSides;
};

type WithBlockGap = { blockGap?: string };

type WpGroupProps = WithChildren & WithClassName & SpacingProps & WithBlockGap & {
  tagName?: string;
};

type WpHeadingProps = WithChildren & WithClassName & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

type WpParagraphProps = WithChildren & WithClassName;

type WpLinkProps = WithChildren & WithClassName & {
  href: string;
};

type WpButtonsProps = WithChildren & WithClassName & SpacingProps;

type WpButtonProps = WithChildren & WithClassName & {
  href: string;
};

type WpColumnsProps = WithChildren & WithClassName & SpacingProps & WithBlockGap;

type WpColumnProps = WithChildren & WithClassName & SpacingProps & {
  width?: string;
};

type WpImageProps = WithClassName & {
  src: string;
  alt?: string;
  sizeSlug?: string;
};

type WpListProps = WithChildren & WithClassName & {
  ordered?: boolean;
};

type WpListItemProps = WithChildren & WithClassName;

type WpSeparatorProps = WithClassName;

type WpSpacerProps = {
  height?: string;
};

export function WpGroup(props: WpGroupProps) {
  return React.createElement(WP_GROUP as any, props, props.children);
}

export function WpHeading(props: WpHeadingProps) {
  return React.createElement(WP_HEADING as any, props, props.children);
}

export function WpParagraph(props: WpParagraphProps) {
  return React.createElement(WP_PARAGRAPH as any, props, props.children);
}

export function WpLink(props: WpLinkProps) {
  return React.createElement(WP_LINK as any, props, props.children);
}

export function WpButtons(props: WpButtonsProps) {
  return React.createElement(WP_BUTTONS as any, props, props.children);
}

export function WpButton(props: WpButtonProps) {
  return React.createElement(WP_BUTTON as any, props, props.children);
}

export function WpColumns(props: WpColumnsProps) {
  return React.createElement(WP_COLUMNS as any, props, props.children);
}

export function WpColumn(props: WpColumnProps) {
  return React.createElement(WP_COLUMN as any, props, props.children);
}

export function WpImage(props: WpImageProps) {
  return React.createElement(WP_IMAGE as any, props);
}

export function WpList(props: WpListProps) {
  return React.createElement(WP_LIST as any, props, props.children);
}

export function WpListItem(props: WpListItemProps) {
  return React.createElement(WP_LIST_ITEM as any, props, props.children);
}

export function WpSeparator(props: WpSeparatorProps = {}) {
  return React.createElement(WP_SEPARATOR as any, props);
}

export function WpSpacer(props: WpSpacerProps) {
  return React.createElement(WP_SPACER as any, props);
}
