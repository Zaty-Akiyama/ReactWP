import React from 'react';
import { WpGroup, WpHeading, WpParagraph, WpLink, type PatternMeta } from '../../lib/wp';

export const pattern: PatternMeta = {
  title: 'Simple CTA',
  slug: 'wp-pattern-test/simple-cta',
  categories: ['featured'],
  description: 'A simple call to action section.'
};

export default function Pattern() {
  return (
    <WpGroup className="cta-section">
      <WpHeading level={1}>お問い合わせはこちら</WpHeading>
      <WpParagraph>Web制作やデザインのご相談を受け付けています。</WpParagraph>
      <WpParagraph className="cta-actions">
        <WpLink href="/contact" className="cta-button">
          お問い合わせ
        </WpLink>
      </WpParagraph>
    </WpGroup>
  );
}