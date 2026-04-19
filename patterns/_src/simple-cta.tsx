import React from 'react';
import { WpGroup, WpHeading, WpParagraph, WpLink, type PatternMeta } from '../../lib/wp';
import styles from './simple-cta.module.css';

export const pattern: PatternMeta = {
  title: 'Simple CTA',
  slug: 'wp-pattern-test/simple-cta',
  categories: ['featured'],
  description: 'A simple call to action section.'
};

export default function Pattern() {
  return (
    <WpGroup className={styles.section}>
      <WpHeading level={1} className={styles.title}>お問い合わせはこちら</WpHeading>
      <WpParagraph>Web制作やデザインのご相談を受け付けています。</WpParagraph>
      <WpParagraph>
        <WpLink href="/contact" className={styles.button}>
          お問い合わせ
        </WpLink>
      </WpParagraph>
    </WpGroup>
  );
}