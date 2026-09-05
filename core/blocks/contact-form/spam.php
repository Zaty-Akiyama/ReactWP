<?php

defined('ABSPATH') || exit;

/**
 * Honeypot欄(website)に値が入っていればボットとみなす。
 *
 * @param array<string, mixed> $raw
 */
function reactwp_contact_is_honeypot_filled(array $raw): bool
{
    $value = isset($raw['website']) ? trim((string) wp_unslash($raw['website'])) : '';

    return $value !== '';
}

/**
 * フォーム表示から一定時間未満での送信を高速送信(ボット)とみなす。
 *
 * @param array<string, mixed> $raw
 */
function reactwp_contact_is_too_fast(array $raw): bool
{
    $started_at = isset($raw['contact_form_started_at'])
        ? (int) wp_unslash($raw['contact_form_started_at'])
        : 0;

    if ($started_at <= 0) {
        return true;
    }

    return (time() - $started_at) < REACTWP_CONTACT_MIN_SUBMIT_SECONDS;
}

/**
 * 本文中に含まれるURLの数を数える。
 */
function reactwp_contact_count_urls(string $value): int
{
    return (int) preg_match_all('#https?://[^\s]+#i', $value, $matches);
}

/**
 * 同一送信元からの送信回数を数え、制限を超えていれば拒否する。
 * IPアドレスは保存せず、ハッシュ化した値のみtransientで一時管理する。
 *
 * nonce確認等より前に呼び、結果に関わらずすべての試行をカウントすること。
 * そうしないと、不正なnonceやHoneypotで弾かれるだけの攻撃がレート制限を
 * すり抜けてしまう。
 */
function reactwp_contact_is_rate_limited(string $ip_hash): bool
{
    $key   = reactwp_contact_rate_limit_key($ip_hash);
    $count = (int) get_transient($key);

    if ($count >= REACTWP_CONTACT_RATE_LIMIT_COUNT) {
        return true;
    }

    set_transient($key, $count + 1, REACTWP_CONTACT_RATE_LIMIT_WINDOW);

    return false;
}

/**
 * ボットシグナル検知によるブロック用transientキーを生成する。
 */
function reactwp_contact_block_key(string $ip_hash): string
{
    return 'reactwp_contact_block_' . $ip_hash;
}

/**
 * ボットシグナル(不正nonce・Honeypot・高速送信)の連続検知回数を数える
 * 用のtransientキーを生成する。
 */
function reactwp_contact_bot_signal_key(string $ip_hash): string
{
    return 'reactwp_contact_bot_signal_' . $ip_hash;
}

/**
 * このIPが、ボットシグナルの連続検知によりブロック中かどうか。
 */
function reactwp_contact_is_blocked(string $ip_hash): bool
{
    return (bool) get_transient(reactwp_contact_block_key($ip_hash));
}

/**
 * 不正nonce・Honeypot・高速送信等、明確なボットシグナルを検知した際に呼ぶ。
 * 一定回数を超えると、通常のレート制限よりも長い時間ブロックする。
 */
function reactwp_contact_register_bot_signal(string $ip_hash): void
{
    $key   = reactwp_contact_bot_signal_key($ip_hash);
    $count = (int) get_transient($key) + 1;

    set_transient($key, $count, REACTWP_CONTACT_BOT_BLOCK_DURATION);

    if ($count >= REACTWP_CONTACT_BOT_SIGNAL_THRESHOLD) {
        set_transient(
            reactwp_contact_block_key($ip_hash),
            1,
            REACTWP_CONTACT_BOT_BLOCK_DURATION
        );

        reactwp_contact_log('ip_blocked', ['signal_count' => $count]);
    }
}

/**
 * 同一内容の連続送信(二重送信)を短時間Transientで検知する。
 *
 * @param array<string, string> $values
 */
function reactwp_contact_is_duplicate_submission(string $ip_hash, array $values): bool
{
    $hash = md5($ip_hash . '|' . wp_json_encode($values));
    $key  = 'reactwp_contact_dup_' . $hash;

    if (get_transient($key)) {
        return true;
    }

    set_transient($key, 1, MINUTE_IN_SECONDS);

    return false;
}
