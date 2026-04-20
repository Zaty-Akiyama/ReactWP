import React from 'react';
import {
  WP_GROUP, WP_HEADING, WP_PARAGRAPH, WP_LINK,
  WP_BUTTONS, WP_BUTTON, WP_COLUMNS, WP_COLUMN,
  WP_IMAGE, WP_LIST, WP_LIST_ITEM, WP_SEPARATOR, WP_SPACER,
  type PatternMeta,
} from './wp.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
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

  const { type, props } = node;

  if (typeof type === 'function') {
    const componentType = type as any;

    if (componentType.prototype?.isReactComponent) {
      throw new Error('Class components are not supported.');
    }

    return renderWpNode(componentType(props));
  }

  if (typeof type === 'string') {
    switch (type) {
      case WP_GROUP:
        return renderGroup(props);
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