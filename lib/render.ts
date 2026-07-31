import React from 'react';
import type { PatternMeta } from './core/pattern.js';

import {
  renderOriginalBlock,
} from './blocks/index.js';

import {
  renderCoreBlock,
} from './core/registry.js';

import {
  openBlockComment,
  closeBlockComment,
  selfClosingBlockComment,
  buildSpacing,
  serializeBlockAttrs,
} from './core/shared.js';

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
    const context = {
      renderNode: renderWpNode,
      serializeAttrs: serializeBlockAttrs,
      escapeAttr,
      openBlockComment,
      closeBlockComment,
      selfClosingBlockComment,
      buildSpacing,
      resolveUrl,
    };

    const originalBlock = renderOriginalBlock(
      type,
      props,
      context,
    );

    if (originalBlock !== null) {
      return originalBlock;
    }

    const coreBlock = renderCoreBlock(type, props, context);

    if (coreBlock !== null) {
      return coreBlock;
    }

    if (SVG_ELEMENTS.has(type)) {
      return renderSvgElement(type, props);
    }

    switch (type) {
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
