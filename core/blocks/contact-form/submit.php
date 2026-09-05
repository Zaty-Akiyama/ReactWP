<?php

defined('ABSPATH') || exit;

/**
 * お問い合わせフォームのPOST送信を処理する。
 *
 * admin-post.php経由でログイン・未ログイン両方から呼ばれる。
 * PHPへ到達した値はすべて未検証として扱い、JS側の検証結果を信用しない。
 */
function reactwp_handle_contact_submit(): void
{
    // 1. POSTメソッド確認
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        wp_safe_redirect(home_url(REACTWP_CONTACT_FORM_PATH));
        exit;
    }

    $raw     = $_POST;
    $ip      = reactwp_contact_get_ip();
    $ip_hash = reactwp_contact_hash_ip($ip);

    // 0. ボットシグナル(不正nonce・Honeypot・高速送信)の連続検知によるブロック確認。
    // 以降のどの判定結果になろうと試行自体を弾けるよう、最初に行う。
    if (reactwp_contact_is_blocked($ip_hash)) {
        reactwp_contact_log('blocked_ip');
        reactwp_contact_redirect_with_errors(
            reactwp_contact_sanitize_input($raw),
            ['_summary' => 'しばらく時間をおいて再度お試しください。']
        );
    }

    // 0.5. レート制限確認。
    // nonce確認より前に行い、この後の判定結果に関わらず全ての試行をカウントする。
    // そうしないと、不正nonceやHoneypotで弾かれるだけの攻撃がすり抜けてしまう。
    if (reactwp_contact_is_rate_limited($ip_hash)) {
        reactwp_contact_log('rate_limited');
        reactwp_contact_redirect_with_errors(
            reactwp_contact_sanitize_input($raw),
            ['_summary' => '送信回数が上限に達しました。しばらく時間をおいて再度お試しください。']
        );
    }

    // 2. nonce確認(nonceだけには依存しないが、まず形式的な確認を行う)
    $nonce = isset($raw[REACTWP_CONTACT_NONCE_FIELD])
        ? (string) wp_unslash($raw[REACTWP_CONTACT_NONCE_FIELD])
        : '';

    if (!wp_verify_nonce($nonce, REACTWP_CONTACT_NONCE_ACTION)) {
        reactwp_contact_register_bot_signal($ip_hash);
        reactwp_contact_log('invalid_nonce');
        reactwp_contact_redirect_with_errors(
            reactwp_contact_sanitize_input($raw),
            ['_summary' => '送信内容を確認できませんでした。お手数ですが、最初からやり直してください。']
        );
    }

    // 3. Honeypot確認
    if (reactwp_contact_is_honeypot_filled($raw)) {
        reactwp_contact_register_bot_signal($ip_hash);
        reactwp_contact_log('honeypot_triggered');
        // ボット向けには成功したように見せて完了ページへ送る
        reactwp_contact_redirect_to_complete();
    }

    // 4. 送信時間確認(表示から一定時間未満は拒否)
    if (reactwp_contact_is_too_fast($raw)) {
        reactwp_contact_register_bot_signal($ip_hash);
        reactwp_contact_log('too_fast_submission');
        reactwp_contact_redirect_with_errors(
            reactwp_contact_sanitize_input($raw),
            ['_summary' => '送信内容を確認できませんでした。少し時間をおいて再度お試しください。']
        );
    }

    // 6-7. 入力値取得・サニタイズ
    $values = reactwp_contact_sanitize_input($raw);

    // 8-9. サーバーバリデーション(URL数制限を含む)
    $errors = reactwp_contact_validate($values);

    if (!empty($errors)) {
        reactwp_contact_log('validation_failed', ['fields' => array_keys($errors)]);
        reactwp_contact_redirect_with_errors($values, $errors);
    }

    // 二重送信防止(同一内容の連続送信を短時間拒否)
    if (reactwp_contact_is_duplicate_submission($ip_hash, $values)) {
        reactwp_contact_log('duplicate_submission');
        reactwp_contact_redirect_to_complete();
    }

    // 10. 管理者メール送信
    $admin_mail_sent = reactwp_contact_send_admin_mail($values);

    if (!$admin_mail_sent) {
        // 管理者メール送信に失敗した場合は完了扱いにしない
        reactwp_contact_redirect_with_errors(
            $values,
            ['_summary' => '送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しいただくか、お電話にてお問い合わせください。']
        );
    }

    // 11. 自動返信メール送信(失敗しても受付自体は完了扱いとし、ログへ記録する)
    reactwp_contact_send_autoreply_mail($values);

    // 12. 完了ページへリダイレクト
    reactwp_contact_redirect_to_complete();
}

add_action('admin_post_reactwp_contact_submit', 'reactwp_handle_contact_submit');
add_action('admin_post_nopriv_reactwp_contact_submit', 'reactwp_handle_contact_submit');
