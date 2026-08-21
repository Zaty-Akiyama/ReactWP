import React from 'react';
import {
  WpGroup,
  type WpGroupProps,
} from '../lib/core/group/component.js';

export type SectionProps = Omit<WpGroupProps, 'tagName'>;

/** Creates a semantic section backed by a WordPress group block. */
export function Section(props: SectionProps) {
  return <WpGroup {...props} tagName="section" />;
}
