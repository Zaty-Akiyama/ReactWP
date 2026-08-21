<?php
/**
 * Title: Layout Components Showcase
 * Slug: reactwp/layout-components
 * Categories: featured
 * Description: A visual test page for reusable layout components.
 */
?>

<!-- wp:group {"tagName":"section","className":"layout-components__section","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<section class="wp-block-group layout-components__section" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"720px","wideSize":"1080px"}} -->
<div class="wp-block-group">
<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
<div class="wp-block-group" style="gap:var(--wp--preset--spacing--40)">
<!-- wp:heading {"level":1} -->
<h1>Layout Components</h1>
<!-- /wp:heading --><!-- wp:paragraph -->
<p>This content is wrapped by a semantic Section and constrained to 720px by Container.</p>
<!-- /wp:paragraph --><!-- wp:group {"className":"layout-components__panel","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","right":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30"},"blockGap":"var:preset|spacing|20"}}} -->
<div class="wp-block-group layout-components__panel" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30);gap:var(--wp--preset--spacing--20)">
<!-- wp:heading {"level":2} -->
<h2>Nested Stack</h2>
<!-- /wp:heading --><!-- wp:paragraph -->
<p>The items in this panel use the spacing preset 20 as their block gap.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</section>
<!-- /wp:group -->