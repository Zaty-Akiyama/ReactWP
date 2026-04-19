<?php
/**
 * Title: Block Examples
 * Slug: reactwp/block-examples
 * Categories: featured
 * Description: All supported block types.
 */
?>

<!-- wp:group {"className":"block-examples__section"} -->
<div class="wp-block-group block-examples__section">
<!-- wp:heading {"level":2,"className":"block-examples__heading"} -->
<h2 class="block-examples__heading">見出しブロック</h2>
<!-- /wp:heading --><!-- wp:paragraph {"className":"block-examples__lead"} -->
<p class="block-examples__lead">段落ブロック。<strong>太字</strong>や<em>斜体</em>、<code>コード</code>も使えます。</p>
<!-- /wp:paragraph --><!-- wp:separator {"className":"block-examples__divider"} -->
<hr class="wp-block-separator has-alpha-channel-opacity block-examples__divider"/>
<!-- /wp:separator --><!-- wp:heading {"level":3} -->
<h3>ボタンブロック</h3>
<!-- /wp:heading --><!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"className":"block-examples__primaryButton"} -->
<div class="wp-block-button block-examples__primaryButton"><a class="wp-block-button__link wp-element-button" href="/contact">お問い合わせ</a></div>
<!-- /wp:button --><!-- wp:button {"className":"block-examples__secondaryButton"} -->
<div class="wp-block-button block-examples__secondaryButton"><a class="wp-block-button__link wp-element-button" href="/about">詳しく見る</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons --><!-- wp:spacer {"height":"48px"} -->
<div style="height:48px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --><!-- wp:heading {"level":3} -->
<h3>カラムブロック</h3>
<!-- /wp:heading --><!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%">
<!-- wp:heading {"level":4} -->
<h4>カラム1</h4>
<!-- /wp:heading --><!-- wp:paragraph -->
<p>左カラムのコンテンツ。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column --><!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%">
<!-- wp:heading {"level":4} -->
<h4>カラム2</h4>
<!-- /wp:heading --><!-- wp:paragraph -->
<p>中央カラムのコンテンツ。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column --><!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%">
<!-- wp:heading {"level":4} -->
<h4>カラム3</h4>
<!-- /wp:heading --><!-- wp:paragraph -->
<p>右カラムのコンテンツ。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns --><!-- wp:spacer {"height":"48px"} -->
<div style="height:48px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --><!-- wp:heading {"level":3} -->
<h3>画像ブロック</h3>
<!-- /wp:heading --><!-- wp:image {"sizeSlug":"large","className":"block-examples__featureImage"} -->
<figure class="wp-block-image size-large block-examples__featureImage"><img src="https://placehold.co/800x400" alt="サンプル画像"/></figure>
<!-- /wp:image --><!-- wp:spacer {"height":"48px"} -->
<div style="height:48px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --><!-- wp:heading {"level":3} -->
<h3>リストブロック（順不同）</h3>
<!-- /wp:heading --><!-- wp:list {"className":"block-examples__list"} -->
<ul class="wp-block-list block-examples__list">
<!-- wp:list-item -->
<li>リストアイテム1</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>リストアイテム2</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>リストアイテム3</li>
<!-- /wp:list-item -->
</ul>
<!-- /wp:list --><!-- wp:spacer {"height":"24px"} -->
<div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --><!-- wp:heading {"level":3} -->
<h3>リストブロック（順序付き）</h3>
<!-- /wp:heading --><!-- wp:list {"ordered":true,"className":"block-examples__list"} -->
<ol class="wp-block-list block-examples__list">
<!-- wp:list-item -->
<li>手順1</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>手順2</li>
<!-- /wp:list-item --><!-- wp:list-item -->
<li>手順3</li>
<!-- /wp:list-item -->
</ol>
<!-- /wp:list --><!-- wp:spacer {"height":"48px"} -->
<div style="height:48px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --><!-- wp:heading {"level":3} -->
<h3>リンク（インライン）</h3>
<!-- /wp:heading --><!-- wp:paragraph -->
<p><a href="/contact">お問い合わせページ</a>へのリンクです。</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->