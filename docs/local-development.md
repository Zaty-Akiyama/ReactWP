# Local WordPress Verification

## MAMP URL

Use `http://localhost:8888/blog.zaty.jp/` for this installation. WordPress `home` and `siteurl` must include port `8888`; otherwise WordPress redirects requests to port 80.

For a machine-local setup, define the URLs in `wp-config.php` before `wp-settings.php` is loaded:

```php
define('WP_HOME', 'http://localhost:8888/blog.zaty.jp');
define('WP_SITEURL', 'http://localhost:8888/blog.zaty.jp');
```

Do not commit machine-specific URL settings or credentials to this theme repository.

## Component Workflow

1. Install dependencies with `npm ci`.
2. Run `npm run watch:patterns` while editing components or patterns.
3. Activate the **ReactWP** theme in **Appearance > Themes**.
4. Create a draft page and insert **Layout Components Showcase** from the pattern picker.
5. Check the draft in both the block editor and Preview. Do not publish the verification page.

After each source change, confirm that `patterns/layout-components.php` and `styles/patterns.css` were regenerated. Before committing, run `npm run typecheck` and `npm run build:patterns`.
