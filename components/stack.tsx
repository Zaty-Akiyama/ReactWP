import React from 'react';
import {
  WpGroup,
  type WpGroupProps,
} from '../lib/core/group/component.js';

export type StackProps = Omit<WpGroupProps, 'blockGap'> & {
  gap?: string;
};

/** Arranges block content vertically with a consistent WordPress block gap. */
export function Stack({ gap, ...props }: StackProps) {
  return <WpGroup {...props} blockGap={gap} />;
}
