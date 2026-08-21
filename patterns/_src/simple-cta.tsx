import {
  Container,
  Section,
  Stack,
  WpHeading,
  WpParagraph,
  WpLink,
  type PatternMeta,
  wpSpacing,
} from '../../lib/wp';
import styles from './simple-cta.module.css';

export const pattern: PatternMeta = {
  title: 'Simple CTA',
  slug: 'wp-pattern-test/simple-cta',
  categories: ['featured'],
  description: 'A simple call to action section.'
};

export default function Pattern() {
  return (
    <Section
      margin={{ top: wpSpacing(50), bottom: wpSpacing(50) }}
      padding={{ top: wpSpacing(70), bottom: wpSpacing(50) }}
    >
      <Container contentSize="720px">
        <Stack gap={wpSpacing(30)}>
          <WpHeading level={1} className={styles.title}>お問い合わせはこちら</WpHeading>
          <WpParagraph>Web制作やデザインのご相談を受け付けています。</WpParagraph>
          <WpParagraph>
            <WpLink href="/contact" className={styles.button}>
              お問い合わせ
            </WpLink>
          </WpParagraph>
        </Stack>
      </Container>
    </Section>
  );
}
