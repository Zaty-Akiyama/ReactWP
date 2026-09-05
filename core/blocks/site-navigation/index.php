<?php

defined('ABSPATH') || exit;

require_once __DIR__ . '/render.php';

function reactwp_register_navigation_menus(): void
{
    $locations = apply_filters(
        'reactwp_navigation_menu_locations',
        [
            'header-navigation' =>
                __('ヘッダーナビゲーション', 'reactwp'),
        ]
    );

    if (is_array($locations) && $locations !== []) {
        register_nav_menus($locations);
    }
}

add_action(
    'after_setup_theme',
    'reactwp_register_navigation_menus',
    99
);

function reactwp_register_site_navigation_block(): void
{
    $view_style_file  = __DIR__ . '/view.css';
    $view_script_file = __DIR__ . '/view.js';

    /**
     * ナビゲーションブロック用CSS
     */
    if (is_readable($view_style_file)) {
        wp_register_style(
            'reactwp-site-navigation',
            get_theme_file_uri(
                'core/blocks/site-navigation/view.css'
            ),
            [],
            (string) filemtime($view_style_file)
        );
    }

    /**
     * ナビゲーションブロック用JavaScript
     */
    if (is_readable($view_script_file)) {
        wp_register_script(
            'reactwp-site-navigation',
            get_theme_file_uri(
                'core/blocks/site-navigation/view.js'
            ),
            [],
            (string) filemtime($view_script_file),
            true
        );
    }

    register_block_type(
        'reactwp/site-navigation',
        [
            'api_version'     => 3,
            'title'           => __('サイトナビゲーション', 'reactwp'),
            'category'        => 'theme',
            'icon'            => 'menu',
            'render_callback' => 'reactwp_render_site_navigation',

            'style_handles' => [
                'reactwp-site-navigation',
            ],
            'view_script_handles' => [
                'reactwp-site-navigation',
            ],

            'attributes' => [
                'className' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'menuLocation' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'ariaLabel' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'toggleLabel' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'closeLabel' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'iconHtml' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'listClassName' => [
                    'type'    => 'string',
                    'default' => '',
                ],
                'items' => [
                    'type'    => 'array',
                    'default' => [],
                    'items'   => [
                        'type' => 'object',
                    ],
                ],
            ],
            'supports' => [
                'autoRegister'    => true,
                'html'            => false,
                'className'       => true,
                'customClassName' => true,
                'contentRole'     => true,
            ],
        ]
    );
}

add_action(
    'init',
    'reactwp_register_site_navigation_block'
);