<?php

defined('ABSPATH') || exit;

const REACTWP_CONTACT_NONCE_ACTION  = 'reactwp_contact_submit';
const REACTWP_CONTACT_NONCE_FIELD   = 'reactwp_contact_nonce';
const REACTWP_CONTACT_COMPLETE_PATH = '/contact/complete/';
const REACTWP_CONTACT_FORM_PATH     = '/contact/';

/** 送信からこの秒数未満での送信はボット送信とみなして拒否する */
const REACTWP_CONTACT_MIN_SUBMIT_SECONDS = 3;

/** 同一送信元からの許容送信回数 */
const REACTWP_CONTACT_RATE_LIMIT_COUNT = 5;

/** レート制限の期間(秒) */
const REACTWP_CONTACT_RATE_LIMIT_WINDOW = 10 * MINUTE_IN_SECONDS;

/** お問い合わせ内容に含めてよいURLの最大数 */
const REACTWP_CONTACT_MAX_URLS = 3;

/** 不正nonce・Honeypot・高速送信等、明確なボットシグナルの連続検知回数 */
const REACTWP_CONTACT_BOT_SIGNAL_THRESHOLD = 3;

/** ボットシグナル検知によるブロック時間(秒) */
const REACTWP_CONTACT_BOT_BLOCK_DURATION = HOUR_IN_SECONDS;

/**
 * フォーム送信元IPアドレスを取得する。
 *
 * X-Forwarded-Forは無条件に信用せず、REMOTE_ADDRを基本とする。
 * プロキシ経由の環境では、必要に応じてフィルターで差し替える。
 */
function reactwp_contact_get_ip(): string
{
    $ip = isset($_SERVER['REMOTE_ADDR'])
        ? (string) $_SERVER['REMOTE_ADDR']
        : '';

    /**
     * 送信元IPアドレスの取得方法を変更する。
     * リバースプロキシ配下ではX-Forwarded-Forの先頭値等を
     * 信頼できる形で解決してから返すこと。
     *
     * @param string $ip
     */
    $ip = (string) apply_filters('reactwp_contact_ip_address', $ip);

    return $ip;
}

/**
 * IPアドレスをそのまま保存しないよう、ハッシュ化する。
 */
function reactwp_contact_hash_ip(string $ip): string
{
    return hash_hmac('sha256', $ip, wp_salt('auth'));
}

/**
 * レート制限用のtransientキーを生成する。
 */
function reactwp_contact_rate_limit_key(string $ip_hash): string
{
    return 'reactwp_contact_rate_' . $ip_hash;
}

/**
 * エラー・入力値の一時保存キーを生成する。
 */
function reactwp_contact_state_key(string $token): string
{
    return 'reactwp_contact_state_' . $token;
}

/**
 * 入力値・エラーをtransientへ短時間保存し、トークンを返す。
 *
 * @param array<string, string> $values
 * @param array<string, string> $errors
 */
function reactwp_contact_store_state(array $values, array $errors): string
{
    $token = wp_generate_password(32, false, false);

    set_transient(
        reactwp_contact_state_key($token),
        [
            'values' => $values,
            'errors' => $errors,
        ],
        5 * MINUTE_IN_SECONDS
    );

    return $token;
}

/**
 * トークンから入力値・エラーを取得し、取得後は削除する。
 *
 * @return array{values: array<string, string>, errors: array<string, string>}|null
 */
function reactwp_contact_consume_state(string $token): ?array
{
    if ($token === '') {
        return null;
    }

    $key  = reactwp_contact_state_key($token);
    $data = get_transient($key);

    delete_transient($key);

    if (!is_array($data)) {
        return null;
    }

    return [
        'values' => is_array($data['values'] ?? null) ? $data['values'] : [],
        'errors' => is_array($data['errors'] ?? null) ? $data['errors'] : [],
    ];
}

/**
 * エラー付きで入力画面へ戻す。
 *
 * @param array<string, string> $values
 * @param array<string, string> $errors
 */
function reactwp_contact_redirect_with_errors(array $values, array $errors): void
{
    $token = reactwp_contact_store_state($values, $errors);

    wp_safe_redirect(
        add_query_arg(
            [
                'contact_status' => 'error',
                'contact_token'  => $token,
            ],
            home_url(REACTWP_CONTACT_FORM_PATH)
        )
    );

    exit;
}

/**
 * 完了ページへリダイレクトする(PRGパターン)。
 */
function reactwp_contact_redirect_to_complete(): void
{
    wp_safe_redirect(home_url(REACTWP_CONTACT_COMPLETE_PATH));
    exit;
}

/**
 * 個人情報を含めない範囲でログへ記録する。
 *
 * @param array<string, mixed> $context
 */
function reactwp_contact_log(string $type, array $context = []): void
{
    $entry = [
        'time'       => gmdate('c'),
        'type'       => $type,
        'request_id' => reactwp_contact_request_id(),
        'context'    => $context,
    ];

    error_log('[reactwp_contact] ' . wp_json_encode($entry));
}

/**
 * リクエストごとに一意なIDを生成・キャッシュする(ログの突合用)。
 */
function reactwp_contact_request_id(): string
{
    static $request_id = null;

    if ($request_id === null) {
        $request_id = wp_generate_password(12, false, false);
    }

    return $request_id;
}
