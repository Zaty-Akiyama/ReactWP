# Repository Guidelines

## Project Structure & Module Organization

This repository is a WordPress block theme that defines blocks and patterns with React/TypeScript and renders them to WordPress-compatible PHP.

- `lib/` contains rendering utilities, WordPress primitives, and block implementations. Core blocks live in `lib/core/<block>/`; custom blocks live in `lib/blocks/`.
- `patterns/_src/` contains editable pattern components and co-located CSS Modules. Generated pattern PHP is written to `patterns/`.
- `scripts/` contains the pattern builder, watcher, and CSS Module loader.
- `core/` contains PHP and browser assets used at WordPress runtime.
- `templates/`, `parts/`, `theme.json`, `functions.php`, and `style.css` form the WordPress theme entry points.
- `styles/patterns.css` and `styles/_per-pattern/` are generated outputs; update their sources instead of editing them directly.
- `core/runtime/_src/view-script-runtime.ts` is the browser runtime bundled by `npm run build:patterns` into `core/runtime/view-script-runtime.js`. A pattern can call `useViewScript(handler)` (from `lib/wp`) once, during render, to register front-end-only behavior; the build extracts the callback, bundles it per pattern under `assets/generated/view-scripts/`, and the `reactwp/view-script` block enqueues it only on pages that use that pattern. The callback may only reference its own parameters/locals and browser globals — no closures over outer variables.
- The `reactwp/contact-form` block (`core/blocks/contact-form/`, `lib/blocks/contact-form/`) handles its own nonce, honeypot, rate limiting, and bot-signal blocking, and redirects to `/contact/` (errors) or `/contact/complete/` (success) via `admin-post.php`. A theme using this block must provide pages at those paths. Configure the notification recipient via the `REACTWP_CONTACT_ADMIN_EMAIL` constant or the `reactwp_contact_admin_recipient` filter (defaults to the site admin email), and override field definitions via the `reactwp_contact_form_fields` filter.

## Build, Test, and Development Commands

Install dependencies with `npm ci`. Then use:

- `npm run build:patterns` — compile every `patterns/_src/*.tsx` file to PHP and merge generated CSS.
- `npm run watch:patterns` — rebuild pattern output while source files change.
- `npm run typecheck` — run strict TypeScript validation without emitting JavaScript.

There is no automated test suite yet. Before submitting changes, run both `npm run typecheck` and `npm run build:patterns`, then inspect the affected pattern or block in the WordPress editor and front end.

## Coding Style & Naming Conventions

Use two-space indentation in TypeScript/TSX and four spaces in PHP. Follow existing TypeScript conventions: single quotes, semicolons, named type exports, and PascalCase React components such as `WpParagraph`. Use kebab-case directories and pattern filenames (`post-title/`, `simple-cta.tsx`), and name CSS Modules `<pattern>.module.css`. Keep each block's `component.tsx`, `render.ts`, and `index.ts` responsibilities separate. TypeScript runs in strict mode; avoid `any` unless clearly justified.

## Testing Guidelines

Treat generated output as part of verification. Confirm rebuilt PHP contains valid WordPress block comments and that CSS class names match the generated stylesheet. If adding tests later, co-locate them with the relevant module using `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

History uses short, imperative summaries, sometimes with a Conventional Commit prefix (for example, `feat: Add site navigation block`). Keep commits focused and describe the user-visible change. Pull requests should include a concise summary, verification commands, linked issue when applicable, and screenshots for editor or front-end visual changes. Commit regenerated PHP and CSS whenever their sources change.
