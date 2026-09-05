import React from 'react';
import type { WithClassName, WithDataAttrs } from '../types.js';

export const WP_IMAGE = '__wp_image__';

export type WpImageProps = WithClassName & WithDataAttrs & {
  src: string;
  alt?: string;
  sizeSlug?: string;
};

export function WpImage(props: WpImageProps) {
  return React.createElement(WP_IMAGE as any, props);
}
