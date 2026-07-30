<?php
include_once get_theme_file_path('core/bootstrap.php');

/**
 * ブロックエディター内のスタイル
 */
function reactwp_setup_editor_styles(): void
{
    add_editor_style([
        get_stylesheet_uri(),
        get_theme_file_uri('styles/patterns.css'),
    ]);
}

add_action(
    'after_setup_theme',
    'reactwp_setup_editor_styles'
);

/**
 * フロント側のスタイル
 */
function reactwp_enqueue_theme_styles(): void
{
    $style_file    = get_stylesheet_directory() . '/style.css';
    $patterns_file = get_theme_file_path('styles/patterns.css');

    /*
     * テーマ直下のstyle.css
     */
    if (is_readable($style_file)) {
        wp_enqueue_style(
            'reactwp-style',
            get_stylesheet_uri(),
            [],
            (string) filemtime($style_file)
        );
    }

    /*
     * パターンごとのCSS
     */
    if (is_readable($patterns_file)) {
        wp_enqueue_style(
            'reactwp-patterns',
            get_theme_file_uri('styles/patterns.css'),
            ['reactwp-style'],
            (string) filemtime($patterns_file)
        );
    }
}

add_action(
    'wp_enqueue_scripts',
    'reactwp_enqueue_theme_styles',
    100
);
