import type React from 'react';

export type WithChildren = { children?: React.ReactNode };
export type WithClassName = { className?: string };

export type SpacingSides = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type SpacingProps = {
  padding?: string | SpacingSides;
  margin?: string | SpacingSides;
};

export type WithBlockGap = { blockGap?: string };

export type CoreBlockProps = Record<string, any> & {
  children?: React.ReactNode;
};

export type CoreBlockRenderContext = {
  renderNode: (node: React.ReactNode) => string;
  serializeAttrs: (attrs: Record<string, unknown>) => string;
  escapeAttr: (value: string) => string;
  openBlockComment: (name: string, attrs: Record<string, unknown>) => string;
  closeBlockComment: (name: string) => string;
  selfClosingBlockComment: (name: string, attrs: Record<string, unknown>) => string;
  buildSpacing: (props: Record<string, any>) => {
    attrs: Record<string, unknown>;
    css: string;
  };
  resolveUrl: (value: string) => { blockValue: string; htmlValue: string };
};

export type CoreBlockRenderer = (
  props: CoreBlockProps,
  context: CoreBlockRenderContext,
) => string;
