import {
  Container,
  Section,
  Stack,
  WpHeading,
  WpParagraph,
  type PatternMeta,
  wpSpacing,
} from '../../lib/wp';
import styles from './layout-components.module.css';

export const pattern: PatternMeta = {
  title: 'Layout Components Showcase',
  slug: 'reactwp/layout-components',
  categories: ['featured'],
  description: 'A visual test page for reusable layout components.',
};

export default function Pattern() {
  return (
    <Section
      className={styles.section}
      padding={{ top: wpSpacing(60), bottom: wpSpacing(60) }}
    >
      <Container contentSize="720px" wideSize="1080px">
        <Stack gap={wpSpacing(40)}>
          <WpHeading level={1}>Layout Components</WpHeading>
          <WpParagraph>
            This content is wrapped by a semantic Section and constrained to 720px by Container.
          </WpParagraph>
          <Stack className={styles.panel} gap={wpSpacing(20)} padding={wpSpacing(30)}>
            <WpHeading level={2}>Nested Stack</WpHeading>
            <WpParagraph>
              The items in this panel use the spacing preset 20 as their block gap.
            </WpParagraph>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
