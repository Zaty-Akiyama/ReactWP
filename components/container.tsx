import React from 'react';
import {
  WpGroup,
  type WpGroupProps,
} from '../lib/core/group/component.js';

export type ContainerProps = Omit<WpGroupProps, 'layout'> & {
  contentSize?: string;
  wideSize?: string;
};

/** Constrains child content using WordPress's native group layout. */
export function Container({
  contentSize,
  wideSize,
  ...props
}: ContainerProps) {
  return (
    <WpGroup
      {...props}
      layout={{
        type: 'constrained',
        contentSize,
        wideSize,
      }}
    />
  );
}
