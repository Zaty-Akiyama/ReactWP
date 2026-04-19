import {
  WpGroup,
  WpHeading,
  WpParagraph,
  WpLink,
  WpButtons,
  WpButton,
  WpColumns,
  WpColumn,
  WpImage,
  WpList,
  WpListItem,
  WpSeparator,
  WpSpacer,
  type PatternMeta,
} from '../../lib/wp';
import styles from './block-examples.module.css';

export const pattern: PatternMeta = {
  title: 'Block Examples',
  slug: 'reactwp/block-examples',
  categories: ['featured'],
  description: 'All supported block types.',
};

export default function Pattern() {
  return (
    <WpGroup className={styles.section}>

      {/* WpHeading / WpParagraph */}
      <WpHeading level={2} className={styles.heading}>見出しブロック</WpHeading>
      <WpParagraph className={styles.lead}>
        段落ブロック。<strong>太字</strong>や<em>斜体</em>、<code>コード</code>も使えます。
      </WpParagraph>

      <WpSeparator className={styles.divider} />

      {/* WpButtons / WpButton */}
      <WpHeading level={3}>ボタンブロック</WpHeading>
      <WpButtons>
        <WpButton href="/contact" className={styles.primaryButton}>お問い合わせ</WpButton>
        <WpButton href="/about" className={styles.secondaryButton}>詳しく見る</WpButton>
      </WpButtons>

      <WpSpacer height="48px" />

      {/* WpColumns / WpColumn */}
      <WpHeading level={3}>カラムブロック</WpHeading>
      <WpColumns>
        <WpColumn width="33.33%">
          <WpHeading level={4}>カラム1</WpHeading>
          <WpParagraph>左カラムのコンテンツ。</WpParagraph>
        </WpColumn>
        <WpColumn width="33.33%">
          <WpHeading level={4}>カラム2</WpHeading>
          <WpParagraph>中央カラムのコンテンツ。</WpParagraph>
        </WpColumn>
        <WpColumn width="33.33%">
          <WpHeading level={4}>カラム3</WpHeading>
          <WpParagraph>右カラムのコンテンツ。</WpParagraph>
        </WpColumn>
      </WpColumns>

      <WpSpacer height="48px" />

      {/* WpImage */}
      <WpHeading level={3}>画像ブロック</WpHeading>
      <WpImage
        src="https://placehold.co/800x400"
        alt="サンプル画像"
        sizeSlug="large"
        className={styles.featureImage}
      />

      <WpSpacer height="48px" />

      {/* WpList / WpListItem */}
      <WpHeading level={3}>リストブロック（順不同）</WpHeading>
      <WpList className={styles.list}>
        <WpListItem>リストアイテム1</WpListItem>
        <WpListItem>リストアイテム2</WpListItem>
        <WpListItem>リストアイテム3</WpListItem>
      </WpList>

      <WpSpacer height="24px" />

      <WpHeading level={3}>リストブロック（順序付き）</WpHeading>
      <WpList ordered className={styles.list}>
        <WpListItem>手順1</WpListItem>
        <WpListItem>手順2</WpListItem>
        <WpListItem>手順3</WpListItem>
      </WpList>

      <WpSpacer height="48px" />

      {/* WpLink (inline) */}
      <WpHeading level={3}>リンク（インライン）</WpHeading>
      <WpParagraph>
        <WpLink href="/contact">お問い合わせページ</WpLink>へのリンクです。
      </WpParagraph>

    </WpGroup>
  );
}
