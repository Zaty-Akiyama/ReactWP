import type React from 'react';

export type OriginalBlockProps =
  Record<string, unknown> & {
    children?: React.ReactNode;
  };

export type OriginalBlockRenderContext = {
  renderNode: (node: React.ReactNode) => string;
  serializeAttrs: (
    attrs: Record<string, unknown>,
  ) => string;
  escapeAttr: (value: string) => string;
};

export type OriginalBlockRenderer = (
  props: OriginalBlockProps,
  context: OriginalBlockRenderContext,
) => string;