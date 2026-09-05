<?php

defined('ABSPATH') || exit;

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/validation.php';
require_once __DIR__ . '/spam.php';
require_once __DIR__ . '/mail.php';
require_once __DIR__ . '/render.php';
require_once __DIR__ . '/submit.php';

/**
 * お問い合わせフォームブロック。
 *
 * <form>要素・nonce・送信処理はすべてPHP側(render_callback)が
 * 組み立てる。中身(入力欄・ステップ表示等)はTSX側で生成された
 * 静的なHTMLをそのまま利用する。
 */
function reactwp_register_contact_form_block(): void
{
    register_block_type(
        'reactwp/contact-form',
        [
            'api_version'     => 3,
            'title'           => __('お問い合わせフォーム', 'reactwp'),
            'category'        => 'theme',
            'icon'            => 'email',
            'render_callback' => 'reactwp_render_contact_form',

            'attributes' => [
                'className' => [
                    'type'    => 'string',
                    'default' => '',
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

add_action('init', 'reactwp_register_contact_form_block');
