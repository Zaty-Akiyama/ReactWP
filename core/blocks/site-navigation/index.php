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
    'reactwp_register_navigation_menus'
);

function reactwp_register_site_navigation_block(): void
{
    register_block_type(
        'reactwp/site-navigation',
        [
            'api_version'     => 3,
            'title'           => __(
                'サイトナビゲーション',
                'reactwp'
            ),
            'category'        => 'theme',
            'icon'            => 'menu',
            'render_callback' =>
                'reactwp_render_site_navigation',
            'attributes'      => [
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
            ],
        ]
    );
}

add_action(
    'init',
    'reactwp_register_site_navigation_block'
);