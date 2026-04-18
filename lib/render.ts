import React from 'react';
import { WP_GROUP, WP_HEADING, WP_PARAGRAPH, WP_LINK, type PatternMeta } from './wp.js';

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

function renderGroup(props: any): string {
  const tagName = props.tagName ?? 'div';
  const attrs: Record<string, unknown> = {};

  if (props.tagName) attrs.tagName = props.tagName;
  if (props.className) attrs.className = props.className;

  const classes = ['wp-block-group', props.className].filter(Boolean).join(' ');
  const classAttr = classes ? ` class="${escapeAttr(classes)}"` : '';
  const inner = renderWpNode(props.children);

  return [
    openBlockComment('group', attrs),
    `<${tagName}${classAttr}>`,
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