<?php

defined('ABSPATH') || exit;

/**
 * 属性から空ではないテキストを取得する。
 *
 * @param array<string, mixed> $attributes
 */
function reactwp_site_navigation_get_text(
    array $attributes,
    string $key,
    string $default
): string {
    if (!array_key_exists($key, $attributes)) {
        return $default;
    }

    $value = trim(
        wp_strip_all_tags((string) $attributes[$key])
    );

    return $value !== '' ? $value : $default;
}

/**
 * 空白区切りのクラス名を安全な配列へ変換する。
 *
 * @return string[]
 */
function reactwp_site_navigation_parse_classes($value): array
{
    $classes = preg_split('/\s+/', trim((string) $value));

    if (!is_array($classes)) {
        return [];
    }

    $classes = array_map('sanitize_html_class', $classes);
    $classes = array_filter(
        $classes,
        static fn(string $class_name): bool => $class_name !== ''
    );

    return array_values(array_unique($classes));
}

/**
 * rel属性を安全なトークンへ整形する。
 */
function reactwp_site_navigation_get_rel(
    $value,
    string $target
): string {
    $tokens = preg_split('/\s+/', trim((string) $value));
    $tokens = is_array($tokens) ? $tokens : [];

    $tokens = array_map(
        static function ($token): string {
            return (string) preg_replace(
                '/[^a-zA-Z0-9_-]/',
                '',
                (string) $token
            );
        },
        $tokens
    );

    if ($target === '_blank') {
        $tokens[] = 'noopener';
        $tokens[] = 'noreferrer';
    }

    $tokens = array_filter(
        $tokens,
        static fn(string $token): bool => $token !== ''
    );

    return implode(' ', array_unique($tokens));
}

/**
 * 管理画面で割り当てられたメニューを出力する。
 */
function reactwp_render_assigned_site_navigation_menu(
    string $menu_location,
    string $list_id,
    int $depth
): string {
    if (
        $menu_location === '' ||
        !has_nav_menu($menu_location)
    ) {
        return '';
    }

    $item_class_filter = static function (
        $classes,
        $menu_item,
        $args,
        $item_depth
    ): array {
        $classes = is_array($classes) ? $classes : [];

        if (empty($args->reactwp_site_navigation)) {
            return $classes;
        }

        $classes[] = 'site-navigation__item';

        return array_values(array_unique($classes));
    };

    $link_attributes_filter = static function (
        $attributes,
        $menu_item,
        $args,
        $item_depth
    ): array {
        $attributes = is_array($attributes)
            ? $attributes
            : [];

        if (empty($args->reactwp_site_navigation)) {
            return $attributes;
        }

        $classes = isset($attributes['class'])
            ? reactwp_site_navigation_parse_classes(
                $attributes['class']
            )
            : [];

        $classes[] = 'site-navigation__link';
        $attributes['class'] = implode(
            ' ',
            array_unique($classes)
        );

        return $attributes;
    };

    $submenu_class_filter = static function (
        $classes,
        $args,
        $item_depth
    ): array {
        $classes = is_array($classes) ? $classes : [];

        if (empty($args->reactwp_site_navigation)) {
            return $classes;
        }

        $classes[] = 'site-navigation__sub-list';

        return array_values(array_unique($classes));
    };

    add_filter(
        'nav_menu_css_class',
        $item_class_filter,
        10,
        4
    );
    add_filter(
        'nav_menu_link_attributes',
        $link_attributes_filter,
        10,
        4
    );
    add_filter(
        'nav_menu_submenu_css_class',
        $submenu_class_filter,
        10,
        3
    );

    try {
        $menu_args = [
            'theme_location'          => $menu_location,
            'container'               => false,
            'menu_id'                 => $list_id,
            'menu_class'              => 'site-navigation__list',
            'fallback_cb'             => false,
            'echo'                    => false,
            'depth'                   => $depth,
            'item_spacing'            => 'discard',
            'reactwp_site_navigation' => true,
        ];

        /**
         * 管理画面メニューのwp_nav_menu()引数を変更する。
         *
         * @param array<string, mixed> $menu_args
         * @param string               $menu_location
         */
        $menu_args = apply_filters(
            'reactwp_site_navigation_menu_args',
            $menu_args,
            $menu_location
        );

        $menu = wp_nav_menu($menu_args);
    } finally {
        remove_filter(
            'nav_menu_css_class',
            $item_class_filter,
            10
        );
        remove_filter(
            'nav_menu_link_attributes',
            $link_attributes_filter,
            10
        );
        remove_filter(
            'nav_menu_submenu_css_class',
            $submenu_class_filter,
            10
        );
    }

    return is_string($menu)
        ? trim($menu)
        : '';
}

/**
 * WpSiteNavigationItemから生成されたitems属性を出力する。
 *
 * @param mixed $items
 */
function reactwp_render_site_navigation_items(
    $items,
    string $list_id
): string {
    if (!is_array($items)) {
        return '';
    }

    $item_html = '';

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        $label = isset($item['label'])
            ? trim(wp_strip_all_tags((string) $item['label']))
            : '';

        $href = isset($item['href'])
            ? trim((string) $item['href'])
            : '';

        if ($label === '' || $href === '') {
            continue;
        }

        $item_classes = ['menu-item', 'site-navigation__item'];

        if (!empty($item['className'])) {
            $item_classes = array_merge(
                $item_classes,
                reactwp_site_navigation_parse_classes(
                    $item['className']
                )
            );
        }

        $target = isset($item['target']) &&
            in_array($item['target'], ['_self', '_blank'], true)
                ? (string) $item['target']
                : '';

        $rel = reactwp_site_navigation_get_rel(
            $item['rel'] ?? '',
            $target
        );

        $link_attributes = [
            sprintf('href="%s"', esc_url($href)),
            'class="site-navigation__link"',
        ];

        if ($target !== '') {
            $link_attributes[] = sprintf(
                'target="%s"',
                esc_attr($target)
            );
        }

        if ($rel !== '') {
            $link_attributes[] = sprintf(
                'rel="%s"',
                esc_attr($rel)
            );
        }

        $item_html .= sprintf(
            '<li class="%1$s"><a %2$s>%3$s</a></li>',
            esc_attr(
                implode(' ', array_unique($item_classes))
            ),
            implode(' ', $link_attributes),
            esc_html($label)
        );
    }

    if ($item_html === '') {
        return '';
    }

    return sprintf(
        '<ul id="%1$s" class="site-navigation__list">%2$s</ul>',
        esc_attr($list_id),
        $item_html
    );
}

/**
 * アイコンHTMLで許可する要素・属性を取得する。
 *
 * @return array<string, array<string, bool>>
 */
function reactwp_get_site_navigation_icon_allowed_html(): array
{
    $allowed_html = [
        'span' => [
            'class'       => true,
            'aria-hidden' => true,
        ],
        'i' => [
            'class'       => true,
            'aria-hidden' => true,
        ],
        'svg' => [
            'class'       => true,
            'xmlns'       => true,
            'viewbox'     => true,
            'width'       => true,
            'height'      => true,
            'fill'        => true,
            'stroke'      => true,
            'role'        => true,
            'focusable'   => true,
            'aria-hidden' => true,
        ],
        'g' => [
            'class'     => true,
            'fill'      => true,
            'stroke'    => true,
            'transform' => true,
        ],
        'path' => [
            'class'           => true,
            'd'               => true,
            'fill'            => true,
            'stroke'          => true,
            'stroke-width'    => true,
            'stroke-linecap'  => true,
            'stroke-linejoin' => true,
            'fill-rule'       => true,
            'clip-rule'       => true,
            'transform'       => true,
            'vector-effect'   => true,
        ],
        'circle' => [
            'class'        => true,
            'cx'           => true,
            'cy'           => true,
            'r'            => true,
            'fill'         => true,
            'stroke'       => true,
            'stroke-width' => true,
            'transform'    => true,
        ],
        'ellipse' => [
            'class'        => true,
            'cx'           => true,
            'cy'           => true,
            'rx'           => true,
            'ry'           => true,
            'fill'         => true,
            'stroke'       => true,
            'stroke-width' => true,
            'transform'    => true,
        ],
        'rect' => [
            'class'        => true,
            'x'            => true,
            'y'            => true,
            'rx'           => true,
            'ry'           => true,
            'width'        => true,
            'height'       => true,
            'fill'         => true,
            'stroke'       => true,
            'stroke-width' => true,
            'transform'    => true,
        ],
        'line' => [
            'class'           => true,
            'x1'              => true,
            'y1'              => true,
            'x2'              => true,
            'y2'              => true,
            'stroke'          => true,
            'stroke-width'    => true,
            'stroke-linecap'  => true,
            'stroke-linejoin' => true,
            'transform'       => true,
        ],
        'polyline' => [
            'class'           => true,
            'points'          => true,
            'fill'            => true,
            'stroke'          => true,
            'stroke-width'    => true,
            'stroke-linecap'  => true,
            'stroke-linejoin' => true,
            'transform'       => true,
        ],
        'polygon' => [
            'class'           => true,
            'points'          => true,
            'fill'            => true,
            'stroke'          => true,
            'stroke-width'    => true,
            'stroke-linecap'  => true,
            'stroke-linejoin' => true,
            'transform'       => true,
        ],
        'use' => [
            'class'      => true,
            'href'       => true,
            'xlink:href' => true,
            'fill'       => true,
            'stroke'     => true,
        ],
        'img' => [
            'class'    => true,
            'src'      => true,
            'alt'      => true,
            'width'    => true,
            'height'   => true,
            'loading'  => true,
            'decoding' => true,
        ],
    ];

    /**
     * ナビゲーションアイコン内で許可するHTMLを変更する。
     *
     * @param array<string, array<string, bool>> $allowed_html
     */
    $allowed_html = apply_filters(
        'reactwp_site_navigation_icon_allowed_html',
        $allowed_html
    );

    return is_array($allowed_html)
        ? $allowed_html
        : [];
}

/**
 * WpSiteNavigationIconから生成されたHTMLを取得する。
 *
 * @param array<string, mixed> $attributes
 */
function reactwp_render_site_navigation_icon(
    array $attributes
): string {
    $icon_html = isset($attributes['iconHtml'])
        ? trim((string) $attributes['iconHtml'])
        : '';

    if ($icon_html === '') {
        $icon_html = implode('', [
            '<span class="site-navigation__icon" aria-hidden="true">',
            '<span class="site-navigation__line"></span>',
            '<span class="site-navigation__line"></span>',
            '<span class="site-navigation__line"></span>',
            '</span>',
        ]);
    }

    return wp_kses(
        $icon_html,
        reactwp_get_site_navigation_icon_allowed_html()
    );
}

/**
 * サイトナビゲーションブロックを動的に出力する。
 *
 * @param array<string, mixed> $attributes ブロック属性。
 * @param string               $content    保存済みコンテンツ。
 * @param WP_Block|null        $block      ブロックインスタンス。
 */
function reactwp_render_site_navigation(
    array $attributes,
    string $content = '',
    $block = null
): string {
    $menu_location = isset($attributes['menuLocation'])
        ? sanitize_key((string) $attributes['menuLocation'])
        : '';

    $depth = isset($attributes['depth'])
        ? max(0, (int) $attributes['depth'])
        : 1;

    $panel_id = wp_unique_id('site-navigation-panel-');
    $list_id  = $panel_id . '-list';

    $menu = reactwp_render_assigned_site_navigation_menu(
        $menu_location,
        $list_id,
        $depth
    );

    if ($menu === '') {
        $menu = reactwp_render_site_navigation_items(
            $attributes['items'] ?? [],
            $list_id
        );
    }

    if ($menu === '') {
        return '';
    }

    $registered_locations = get_registered_nav_menus();
    $default_aria_label = isset(
        $registered_locations[$menu_location]
    )
        ? (string) $registered_locations[$menu_location]
        : __('メインナビゲーション', 'reactwp');

    $aria_label = reactwp_site_navigation_get_text(
        $attributes,
        'ariaLabel',
        $default_aria_label
    );

    $toggle_label = reactwp_site_navigation_get_text(
        $attributes,
        'toggleLabel',
        __('メニューを開く', 'reactwp')
    );

    $close_label = reactwp_site_navigation_get_text(
        $attributes,
        'closeLabel',
        __('メニューを閉じる', 'reactwp')
    );

    $icon_html = reactwp_render_site_navigation_icon(
        $attributes
    );

    $wrapper_attributes = get_block_wrapper_attributes([
        'class'                => 'site-navigation',
        'aria-label'           => $aria_label,
        'data-site-navigation' => '',
    ]);

    $html = sprintf(
        '<nav %1$s>' .
            '<button ' .
                'class="site-navigation__toggle" ' .
                'type="button" ' .
                'aria-expanded="false" ' .
                'aria-controls="%2$s" ' .
                'aria-label="%3$s" ' .
                'data-site-navigation-toggle ' .
                'data-open-label="%3$s" ' .
                'data-close-label="%4$s"' .
            '>%5$s</button>' .
            '<div ' .
                'id="%2$s" ' .
                'class="site-navigation__panel" ' .
                'data-site-navigation-panel' .
            '>%6$s</div>' .
        '</nav>',
        $wrapper_attributes,
        esc_attr($panel_id),
        esc_attr($toggle_label),
        esc_attr($close_label),
        $icon_html,
        $menu
    );

    /**
     * サイトナビゲーション全体のHTMLを変更する。
     *
     * @param string               $html
     * @param array<string, mixed> $attributes
     * @param string               $menu
     * @param string               $icon_html
     */
    return (string) apply_filters(
        'reactwp_site_navigation_html',
        $html,
        $attributes,
        $menu,
        $icon_html
    );
}