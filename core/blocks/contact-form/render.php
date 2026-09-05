<?php

defined('ABSPATH') || exit;

/**
 * URLのcontact_status=error&contact_token=...から、
 * 直前の送信内容・エラーを取得する(取得後はtransientから削除される)。
 *
 * @return array{values: array<string, string>, errors: array<string, string>}|null
 */
function reactwp_contact_get_restored_state(): ?array
{
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- 復元用トークンであり、状態変更を伴わない
    $status = isset($_GET['contact_status']) ? sanitize_key((string) wp_unslash($_GET['contact_status'])) : '';

    if ($status !== 'error') {
        return null;
    }

    // phpcs:ignore WordPress.Security.NonceVerification.Recommended
    $token = isset($_GET['contact_token']) ? sanitize_text_field((string) wp_unslash($_GET['contact_token'])) : '';

    return reactwp_contact_consume_state($token);
}

/**
 * reactwp/contact-formブロックを動的に出力する。
 *
 * <form>要素・nonce・admin-post.phpへの送信先・Honeypot・
 * 直前送信のエラー復元をここで組み立てる。$contentはTSX側で
 * 既にレンダリング済みのHTMLとして扱い、二重エスケープしない。
 *
 * @param array<string, mixed> $attributes
 */
function reactwp_render_contact_form(array $attributes, string $content = ''): string
{
    $classes = array_filter([
        'reactwp-contact-form',
        isset($attributes['className']) ? (string) $attributes['className'] : '',
    ]);

    $restored = reactwp_contact_get_restored_state();

    $restore_payload = wp_json_encode([
        'values' => $restored['values'] ?? new stdClass(),
        'errors' => $restored['errors'] ?? new stdClass(),
    ]);

    // <script>タグ内へ埋め込むため、</script>によるタグ抜け出しを防ぐ
    if ($restore_payload !== false) {
        $restore_payload = str_replace('/', '\\/', $restore_payload);
    }

    ob_start();
    ?>
    <form
        class="<?php echo esc_attr(implode(' ', $classes)); ?>"
        action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
        method="post"
        novalidate
        data-contact-form
    >
        <input type="hidden" name="action" value="reactwp_contact_submit">
        <input
            type="hidden"
            name="contact_form_started_at"
            value="<?php echo esc_attr((string) time()); ?>"
        >

        <?php wp_nonce_field(REACTWP_CONTACT_NONCE_ACTION, REACTWP_CONTACT_NONCE_FIELD); ?>

        <div class="reactwp-contact-form__honeypot" aria-hidden="true">
            <label>
                この項目は入力しないでください
                <input
                    type="text"
                    name="website"
                    tabindex="-1"
                    autocomplete="off"
                >
            </label>
        </div>

        <script type="application/json" data-contact-restore><?php
            echo $restore_payload !== false ? $restore_payload : '{}';
        ?></script>

        <?php echo $content; ?>
    </form>
    <?php

    return (string) ob_get_clean();
}
