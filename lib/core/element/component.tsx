import React from 'react';
import type { WithChildren, WithClassName, WithDataAttrs } from '../types.js';

export const WP_ELEMENT = '__wp_element__';

/**
 * WpGroup/WpParagraph等の既存コンポーネントに対応する型がない
 * 生のHTML要素(input, label, button, ol/li, dl/dt/dd等)を出力するための
 * 汎用エスケープハッチ。wp:ブロックコメントは付けず、そのままの要素を出力する。
 */
export type WpElementProps = WithChildren & WithClassName & WithDataAttrs & {
  as: string;
} & Record<string, unknown>;

export function WpElement(props: WpElementProps) {
  return React.createElement(WP_ELEMENT as any, props, props.children);
}
