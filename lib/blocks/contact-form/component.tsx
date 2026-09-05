import React from 'react';
import type { WithChildren, WithClassName, WithDataAttrs } from '../../core/types.js';

export const WP_CONTACT_FORM = '__wp_contact_form__';

export type WpContactFormProps = WithChildren & WithClassName & WithDataAttrs & {
  noValidate?: boolean;
};

export function WpContactForm(props: WpContactFormProps) {
  return React.createElement(WP_CONTACT_FORM as any, props, props.children);
}
