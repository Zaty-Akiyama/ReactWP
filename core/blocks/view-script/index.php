<?php

defined('ABSPATH') || exit;

require_once __DIR__ . '/render.php';

/**
 * useViewScript()の生成JSを対象ページだけで読み込むための、
 * HTMLを出力しないランタイム専用ブロック。
 */
function reactwp_register_view_script_block(): void
{
    register_block_type(
        'reactwp/view-script',
        [
            'api_version'     => 3,
            'title'           => __('ビュースクリプト読み込み', 'reactwp'),
            'category'        => 'theme',
            'icon'            => 'media-code',
            'render_callback' => 'reactwp_render_view_script',

            'attributes' => [
                'name' => [
                    'type'    => 'string',
                    'default' => '',
                ],
            ],
            'supports' => [
                'autoRegister'    => true,
                'html'            => false,
                'className'       => false,
                'customClassName' => false,
                'inserter'        => false,
            ],
        ]
    );
}

add_action(
    'init',
    'reactwp_register_view_script_block'
);

add_action(
    'wp_enqueue_scripts',
    'reactwp_enqueue_active_view_scripts',
    100
);
