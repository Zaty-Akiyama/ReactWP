<?php

defined('ABSPATH') || exit;

/**
 * サイトの会社名。テーマ設定を増やしすぎないよう、まずはフィルターで
 * 上書きできるようにしておく。
 */
function reactwp_contact_company_name(): string
{
    return (string) apply_filters('reactwp_contact_company_name', get_bloginfo('name'));
}

/**
 * 送信元(From)に使うメールアドレス。
 * 問い合わせ者のメールアドレスを直接Fromへ設定しない。
 */
function reactwp_contact_from_address(): string
{
    $host = (string) wp_parse_url(home_url(), PHP_URL_HOST);
    $host = $host !== '' ? $host : 'localhost';

    $default = 'no-reply@' . $host;

    return (string) apply_filters('reactwp_contact_from_address', $default);
}

/**
 * 管理者通知メールの送信先。
 * テーマ設定・定数・オプションで上書きできるようにする。
 */
function reactwp_contact_admin_recipient(): string
{
    $recipient = defined('REACTWP_CONTACT_ADMIN_EMAIL') && REACTWP_CONTACT_ADMIN_EMAIL !== ''
        ? (string) REACTWP_CONTACT_ADMIN_EMAIL
        : (string) get_option('admin_email');

    return (string) apply_filters('reactwp_contact_admin_recipient', $recipient);
}

/**
 * メール本文用に、項目ラベルと値の一覧テキストを組み立てる。
 *
 * @param array<string, string> $values
 * @param string[]               $field_names 出力したい項目名(順序を保つ)
 */
function reactwp_contact_build_body_block(array $values, array $field_names): string
{
    $fields = reactwp_contact_form_fields();
    $lines  = [];

    foreach ($field_names as $name) {
        if (!isset($fields[$name])) {
            continue;
        }

        $label = $fields[$name]['label'];
        $value = trim((string) ($values[$name] ?? ''));

        $lines[] = $label . ':';
        $lines[] = $value !== '' ? $value : '（未入力）';
        $lines[] = '';
    }

    return trim(implode("\n", $lines));
}

/**
 * 管理者通知メールを送信する。
 *
 * @param array<string, string> $values
 */
function reactwp_contact_send_admin_mail(array $values): bool
{
    $to      = reactwp_contact_admin_recipient();
    $company = reactwp_contact_company_name();
    $subject = sprintf('【%s】お問い合わせがありました', $company);

    $body = "ウェブサイトからお問い合わせがありました。\n\n"
        . reactwp_contact_build_body_block(
            $values,
            ['name', 'kana', 'company', 'tel', 'email', 'address', 'message']
        );

    $email = trim((string) ($values['email'] ?? ''));

    $headers = [
        'From: ' . $company . ' <' . reactwp_contact_from_address() . '>',
    ];

    if ($email !== '' && is_email($email) && reactwp_contact_is_safe_header_value($email)) {
        $headers[] = 'Reply-To: ' . $email;
    }

    $sent = wp_mail($to, $subject, $body, $headers);

    if (!$sent) {
        reactwp_contact_log('admin_mail_failed', ['to' => $to]);
    }

    return $sent;
}

/**
 * 問い合わせ者への自動返信メールを送信する。
 *
 * @param array<string, string> $values
 */
function reactwp_contact_send_autoreply_mail(array $values): bool
{
    $email = trim((string) ($values['email'] ?? ''));

    if ($email === '' || !is_email($email) || !reactwp_contact_is_safe_header_value($email)) {
        return false;
    }

    $company = reactwp_contact_company_name();
    $name    = trim((string) ($values['name'] ?? ''));
    $subject = sprintf('【%s】お問い合わせを受け付けました', $company);

    $body = sprintf("%s 様\n\n", $name !== '' ? $name : 'お客') .
        "この度はお問い合わせいただき、誠にありがとうございます。\n" .
        "以下の内容でお問い合わせを受け付けました。\n\n" .
        "担当者より順次ご連絡いたします。\n\n" .
        "------------------------------\n" .
        reactwp_contact_build_body_block($values, ['name', 'company', 'email', 'message']) .
        "\n------------------------------\n\n" .
        "本メールにお心当たりがない場合は、\n" .
        "お手数ですが本メールを破棄してください。";

    $headers = [
        'From: ' . $company . ' <' . reactwp_contact_from_address() . '>',
    ];

    $sent = wp_mail($email, $subject, $body, $headers);

    if (!$sent) {
        reactwp_contact_log('autoreply_mail_failed', []);
    }

    return $sent;
}
