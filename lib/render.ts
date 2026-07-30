import React from 'react';
import {
  WP_GROUP, WP_HEADING, WP_PARAGRAPH, WP_LINK,
  WP_BUTTONS, WP_BUTTON, WP_COLUMNS, WP_COLUMN,
  WP_IMAGE, WP_LIST, WP_LIST_ITEM, WP_SEPARATOR, WP_SPACER,
  WP_COVER,
  WP_NAVIGATION,
  WP_NAVIGATION_LINK,
  WP_HTML,
  WP_SHORTCODE,
  type PatternMeta,
} from './wp.js';

import {
  renderOriginalBlock,
} from './blocks/index.js';

import { escapeHtml } from './escapeHtml.js';
import { escapeAttr } from './escapeAttr.js';
import { resolveUrl } from './resolveUrl.js';

const SVG_ELEMENTS = new Set([
  'svg',
  'g',
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'defs',
  'clipPath',
  'mask',
  'use',
  'symbol',
  'title',
  'desc',
  'linearGradient',
  'radialGradient',
  'stop',
]);

const SVG_ATTRIBUTE_MAP: Record<string, string> = {
  className: 'class',
  xlinkHref: 'xlink:href',
  xmlnsXlink: 'xmlns:xlink',

  fillRule: 'fill-rule',
  fillOpacity: 'fill-opacity',

  clipRule: 'clip-rule',
  clipPath: 'clip-path',

  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeOpacity: 'stroke-opacity',

  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
};

function stylePropertyToCss(property: string): string {
  if (property.startsWith('--')) {
    return property;
  }

  return property.replace(
    /[A-Z]/g,
    (character) => `-${character.toLowerCase()}`,
  );
}

function renderSvgElement(
  tagName: string,
  props: Record<string, any>,
): string {
  const attributes = Object.entries(props)
    .filter(([key, value]) => {
      return (
        key !== 'children' &&
        value !== undefined &&
        value !== null &&
        value !== false
      );
    })
    .map(([key, value]) => {
      const attributeName =
        SVG_ATTRIBUTE_MAP[key] ?? key;

      if (
        key === 'style' &&
        typeof value === 'object' &&
        value !== null
      ) {
        const styleValue = Object.entries(
          value as Record<string, string | number>,
        )
          .map(([property, propertyValue]) => {
            return `${stylePropertyToCss(property)}:${propertyValue}`;
          })
          .join(';');

        return ` style="${escapeAttr(styleValue)}"`;
      }

      return ` ${attributeName}="${escapeAttr(String(value))}"`;
    })
    .join('');

  const inner = renderWpNode(props.children);

  return `<${tagName}${attributes}>${inner}</${tagName}>`;
}

function serializeBlockAttrs(attrs: Record<string, unknown>): string {
  const cleaned = Object.fromEntries(
    Object.entries(attrs).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value === '') return false;
      return true;
    })
  );

  return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : '';
}

type RenderElementProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

function renderHtml(props: RenderElementProps): string {
  const content = renderWpNode(props.children);

  return [
    '<!-- wp:html -->',
    content,
    '<!-- /wp:html -->',
  ].join('\n');
}

function openBlockComment(name: string, attrs: Record<string, unknown>): string {
  const json = serializeBlockAttrs(attrs);
  return json ? `<!-- wp:${name} ${json} -->` : `<!-- wp:${name} -->`;
}

function closeBlockComment(name: string): string {
  return `<!-- /wp:${name} -->`;
}

function presetToCss(value: string): string {
  return value.replace(
    /^var:preset\|([^|]+)\|(.+)$/,
    (_, type, key) => `var(--wp--preset--${type}--${key})`
  );
}

function resolveSpacing(property: string, value: string | Record<string, string>): {
  sides: Record<string, string>;
  css: string;
} {
  const sides =
    typeof value === 'string'
      ? { top: value, right: value, bottom: value, left: value }
      : value;
  const entries = Object.entries(sides).filter(([, v]) => v !== undefined) as [string, string][];
  const css = entries.map(([k, v]) => `${property}-${k}:${presetToCss(v)}`).join(';');
  return { sides: Object.fromEntries(entries), css };
}

type SpacingResult = { attrs: Record<string, unknown>; styleAttr: string };

function buildSpacing(props: { padding?: any; margin?: any; blockGap?: string }): SpacingResult {
  const styleParts: string[] = [];
  const spacing: Record<string, unknown> = {};

  if (props.padding) {
    const { sides, css } = resolveSpacing('padding', props.padding);
    spacing.padding = sides;
    styleParts.push(css);
  }
  if (props.margin) {
    const { sides, css } = resolveSpacing('margin', props.margin);
    spacing.margin = sides;
    styleParts.push(css);
  }
  if (props.blockGap) {
    spacing.blockGap = props.blockGap;
    styleParts.push(`gap:${presetToCss(props.blockGap)}`);
  }

  const attrs = Object.keys(spacing).length > 0 ? { style: { spacing } } : {};
  const styleAttr = styleParts.length > 0 ? ` style="${escapeAttr(styleParts.join(';'))}"` : '';
  return { attrs, styleAttr };
}

function renderCover(props: any): string {
  const attrs: Record<string, unknown> = {};

  const resolvedUrl = props.url
    ? resolveUrl(props.url)
    : null;

  if (resolvedUrl) {
    attrs.url = resolvedUrl.blockValue;
  }

  if (props.id !== undefined) {
    attrs.id = props.id;
  }

  if (props.alt) {
    attrs.alt = props.alt;
  }

  if (props.dimRatio !== undefined) {
    attrs.dimRatio = props.dimRatio;
  }

  if (props.className) {
    attrs.className = props.className;
  }

  const dimRatio = props.dimRatio ?? 60;

  const classes = [
    'wp-block-cover',
    props.className,
  ]
    .filter(Boolean)
    .join(' ');

  const image = resolvedUrl
    ? [
        '<img',
        ' class="wp-block-cover__image-background"',
        ` alt="${escapeAttr(props.alt ?? '')}"`,
        ` src="${resolvedUrl.htmlValue}"`,
        ' data-object-fit="cover"',
        ' />',
      ].join('')
    : '';

  const overlay = [
    '<span',
    ' aria-hidden="true"',
    ` class="wp-block-cover__background has-background-dim-${dimRatio} has-background-dim"`,
    '></span>',
  ].join('');

  const inner = renderWpNode(props.children);

  return [
    openBlockComment('cover', attrs),
    `<div class="${escapeAttr(classes)}">`,
    image,
    overlay,
    '<div class="wp-block-cover__inner-container">',
    inner,
    '</div>',
    '</div>',
    closeBlockComment('cover'),
  ].join('\n');
}

function renderGroup(props: any): string {
  const tagName = props.tagName ?? 'div';
  const attrs: Record<string, unknown> = {};

  if (props.tagName) attrs.tagName = props.tagName;
  if (props.className) attrs.className = props.className;

  const classes = ['wp-block-group', props.className].filter(Boolean).join(' ');
  const classAttr = classes ? ` class="${escapeAttr(classes)}"` : '';

  const { attrs: spacingAttrs, styleAttr } = buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const inner = renderWpNode(props.children);

  return [
    openBlockComment('group', attrs),
    `<${tagName}${classAttr}${styleAttr}>`,
    inner,
    `</${tagName}>`,
    closeBlockComment('group'),
  ].join('\n');
}

function renderHeading(props: any): string {
  const level = props.level ?? 2;
  const attrs: Record<string, unknown> = {};

  if (props.level) attrs.level = props.level;
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${escapeAttr(props.className)}"` : '';
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('heading', attrs),
    `<h${level}${classAttr}>${inner}</h${level}>`,
    closeBlockComment('heading'),
  ].join('\n');
}

function renderParagraph(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${escapeAttr(props.className)}"` : '';
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('paragraph', attrs),
    `<p${classAttr}>${inner}</p>`,
    closeBlockComment('paragraph'),
  ].join('\n');
}

function renderLink(props: any): string {
  const href = escapeAttr(props.href);
  const classAttr = props.className ? ` class="${escapeAttr(props.className)}"` : '';
  const inner = renderWpNode(props.children);

  return `<a href="${href}"${classAttr}>${inner}</a>`;
}

function renderButtons(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, styleAttr } = buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const classes = ['wp-block-buttons', props.className].filter(Boolean).join(' ');
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('buttons', attrs),
    `<div class="${escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    closeBlockComment('buttons'),
  ].join('\n');
}

function renderButton(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const divClasses = ['wp-block-button', props.className].filter(Boolean).join(' ');
  const href = escapeAttr(props.href ?? '#');
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('button', attrs),
    `<div class="${escapeAttr(divClasses)}"><a class="wp-block-button__link wp-element-button" href="${href}">${inner}</a></div>`,
    closeBlockComment('button'),
  ].join('\n');
}

function renderColumns(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, styleAttr } = buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const classes = ['wp-block-columns', props.className].filter(Boolean).join(' ');
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('columns', attrs),
    `<div class="${escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    closeBlockComment('columns'),
  ].join('\n');
}

function renderColumn(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.width) attrs.width = props.width;
  if (props.className) attrs.className = props.className;

  const { attrs: spacingAttrs, styleAttr: spacingStyle } = buildSpacing(props);
  Object.assign(attrs, spacingAttrs);

  const classes = ['wp-block-column', props.className].filter(Boolean).join(' ');
  const flexStyle = props.width ? `flex-basis:${escapeAttr(props.width)}` : '';
  const spacingCss = spacingStyle ? spacingStyle.slice(8, -1) : '';
  const combinedStyle = [flexStyle, spacingCss].filter(Boolean).join(';');
  const styleAttr = combinedStyle ? ` style="${combinedStyle}"` : '';

  const inner = renderWpNode(props.children);

  return [
    openBlockComment('column', attrs),
    `<div class="${escapeAttr(classes)}"${styleAttr}>`,
    inner,
    `</div>`,
    closeBlockComment('column'),
  ].join('\n');
}

function renderImage(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.sizeSlug) attrs.sizeSlug = props.sizeSlug;
  if (props.className) attrs.className = props.className;

  const sizeClass = props.sizeSlug ? `size-${props.sizeSlug}` : '';
  const classes = ['wp-block-image', sizeClass, props.className].filter(Boolean).join(' ');
  const src = escapeAttr(props.src ?? '');
  const alt = escapeAttr(props.alt ?? '');

  return [
    openBlockComment('image', attrs),
    `<figure class="${escapeAttr(classes)}"><img src="${src}" alt="${alt}"/></figure>`,
    closeBlockComment('image'),
  ].join('\n');
}

function renderList(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.ordered) attrs.ordered = true;
  if (props.className) attrs.className = props.className;

  const tag = props.ordered ? 'ol' : 'ul';
  const classes = ['wp-block-list', props.className].filter(Boolean).join(' ');
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('list', attrs),
    `<${tag} class="${escapeAttr(classes)}">`,
    inner,
    `</${tag}>`,
    closeBlockComment('list'),
  ].join('\n');
}

function renderListItem(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classAttr = props.className ? ` class="${escapeAttr(props.className)}"` : '';
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('list-item', attrs),
    `<li${classAttr}>${inner}</li>`,
    closeBlockComment('list-item'),
  ].join('\n');
}

function renderSeparator(props: any): string {
  const attrs: Record<string, unknown> = {};
  if (props.className) attrs.className = props.className;

  const classes = ['wp-block-separator has-alpha-channel-opacity', props.className]
    .filter(Boolean).join(' ');

  return [
    openBlockComment('separator', attrs),
    `<hr class="${escapeAttr(classes)}"/>`,
    closeBlockComment('separator'),
  ].join('\n');
}

function renderSpacer(props: any): string {
  const height: string = props.height ?? '40px';

  return [
    openBlockComment('spacer', { height }),
    `<div style="height:${escapeAttr(height)}" aria-hidden="true" class="wp-block-spacer"></div>`,
    closeBlockComment('spacer'),
  ].join('\n');
}

function renderInlineElement(tagName: string, props: any): string {
  if (tagName === 'br') {
    return '<br />';
  }

  const classAttr = props.className ? ` class="${escapeAttr(props.className)}"` : '';
  const inner = renderWpNode(props.children);

  return `<${tagName}${classAttr}>${inner}</${tagName}>`;
}

export function renderWpNode(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return escapeHtml(String(node));
  }

  if (Array.isArray(node)) {
    return node.map(renderWpNode).join('');
  }

  if (!React.isValidElement(node)) {
    throw new Error('Unsupported node.');
  }
  
  const { type } = node;
  const props = node.props as Record<string, any>;

  if (typeof type === 'function') {
    const componentType = type as any;

    if (componentType.prototype?.isReactComponent) {
      throw new Error('Class components are not supported.');
    }

    return renderWpNode(componentType(props));
  }

  if (typeof type === 'string') {
    const originalBlock = renderOriginalBlock(
      type,
      props,
      {
        renderNode: renderWpNode,
        serializeAttrs: serializeBlockAttrs,
        escapeAttr,
      },
    );

    if (originalBlock !== null) {
      return originalBlock;
    }

    switch (type) {
      case WP_GROUP:
        return renderGroup(props);

      case WP_COVER:
        return renderCover(props);

      case WP_HTML:
        return renderHtml(props);

      case WP_SHORTCODE:
        return renderShortcode(props);
    }
    if (SVG_ELEMENTS.has(type)) {
      return renderSvgElement(type, props);
    }
    switch (type) {
      case WP_HEADING:
        return renderHeading(props);
      case WP_PARAGRAPH:
        return renderParagraph(props);
      case WP_LINK:
        return renderLink(props);
      case WP_BUTTONS:
        return renderButtons(props);
      case WP_BUTTON:
        return renderButton(props);
      case WP_COLUMNS:
        return renderColumns(props);
      case WP_COLUMN:
        return renderColumn(props);
      case WP_IMAGE:
        return renderImage(props);
      case WP_LIST:
        return renderList(props);
      case WP_LIST_ITEM:
        return renderListItem(props);
      case WP_SEPARATOR:
        return renderSeparator(props);
      case WP_SPACER:
        return renderSpacer(props);
      case WP_NAVIGATION:
        return renderNavigation(props);
      case WP_NAVIGATION_LINK:
        return renderNavigationLink(props);
      case 'strong':
      case 'em':
      case 'span':
      case 'code':
      case 'br':
        return renderInlineElement(type, props);
      default:
        throw new Error(`Unsupported intrinsic element: ${type}`);
    }
  }

  throw new Error('Unsupported React element type.');
}

export function renderPatternPhp(meta: PatternMeta, body: string): string {
  const lines: string[] = [
    '<?php',
    '/**',
    ` * Title: ${meta.title}`,
    ` * Slug: ${meta.slug}`,
  ];

  if (meta.categories?.length) {
    lines.push(` * Categories: ${meta.categories.join(', ')}`);
  }

  if (meta.description) {
    lines.push(` * Description: ${meta.description}`);
  }

  lines.push(' */');
  lines.push('?>');
  lines.push('');
  lines.push(body);

  return lines.join('\n');
}

function renderNavigation(props: Record<string, any>): string {
  const attrs: Record<string, unknown> = {};

  if (props.className) {
    attrs.className = props.className;
  }

  if (props.overlayMenu) {
    attrs.overlayMenu = props.overlayMenu;
  }

  attrs.layout = {
    type: 'flex',
    orientation: props.orientation ?? 'horizontal',
    ...(props.justifyContent
      ? { justifyContent: props.justifyContent }
      : {}),
  };

  return [
    openBlockComment('navigation', attrs),
    renderWpNode(props.children),
    closeBlockComment('navigation'),
  ].join('\n');
}

function renderNavigationLink(
  props: Record<string, any>,
): string {
  const attrs: Record<string, unknown> = {
    label: props.label,
    url: props.url,
    kind: props.kind ?? 'custom',
    isTopLevelLink: true,
  };

  if (props.className) {
    attrs.className = props.className;
  }

  if (props.opensInNewTab !== undefined) {
    attrs.opensInNewTab = props.opensInNewTab;
  }

  if (props.rel) {
    attrs.rel = props.rel;
  }

  return `<!-- wp:navigation-link ${JSON.stringify(attrs)} /-->`;
}

function renderShortcode(props: RenderElementProps): string {
  if (typeof props.children !== 'string') {
    throw new Error('WpShortcode children must be a string.');
  }

  return [
    '<!-- wp:shortcode -->',
    props.children,
    '<!-- /wp:shortcode -->',
  ].join('\n');
}