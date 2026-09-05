import { WpGroup } from '../lib/core/group/component.js';
import { WpHeading } from '../lib/core/heading/component.js';
import { WpParagraph } from '../lib/core/paragraph/component.js';

import styles from './SectionTitle.module.css';

type SectionTitleProps = {
  label: string;
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export default function SectionTitle({
  label,
  title,
  level = 2,
  className = '',
}: SectionTitleProps) {
  return (
    <WpGroup className={`${styles.root} ${className}`.trim()}>
      <WpParagraph className={styles.label}>{label}</WpParagraph>
      <WpHeading className={styles.title} level={level}>
        {title}
      </WpHeading>
    </WpGroup>
  );
}