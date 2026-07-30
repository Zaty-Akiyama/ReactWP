<?php

/**
 * 現在の日付を指定形式で出力するショートコード
 */
function date_shortcode($atts = []): string
{
    $atts = shortcode_atts(
        [
            'format' => 'Y',
        ],
        is_array($atts) ? $atts : [],
        'date'
    );

    $format = isset($atts['format'])
        ? (string) $atts['format']
        : 'Y';

    return esc_html(wp_date($format));
}

add_shortcode('date', 'date_shortcode');

/**
 * Shortcodeブロック内のショートコードを実行する
 */
function reactwp_render_shortcode_block(string $block_content): string {
    if (!has_shortcode($block_content, 'date')) {
        return $block_content;
    }

    return do_shortcode($block_content);
}

add_filter(
    'render_block_core/shortcode',
    'reactwp_render_shortcode_block',
    10,
    2
);