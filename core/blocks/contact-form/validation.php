<?php

defined('ABSPATH') || exit;

/**
 * 入力項目の定義。バリデーション・メール本文生成・確認画面表示で共通利用する。
 *
 * 氏名・メールアドレス・お問い合わせ内容は必須。
 * それ以外(ふりがな・会社名・電話番号・住所)は既存デザイン(現行仕様)に
 * 合わせて任意項目としている。実際の仕様が異なる場合はここを調整すること。
 *
 * @return array<string, array{label: string, required: bool, max_length: int, type: string}>
 */
function reactwp_contact_form_fields(): array
{
    $fields = [
        'name' => [
            'label'      => '氏名',
            'required'   => true,
            'max_length' => 100,
            'type'       => 'text',
        ],
        'kana' => [
            'label'      => '氏名ふりがな',
            'required'   => false,
            'max_length' => 100,
            'type'       => 'text',
        ],
        'company' => [
            'label'      => '会社名',
            'required'   => false,
            'max_length' => 200,
            'type'       => 'text',
        ],
        'tel' => [
            'label'      => '電話番号',
            'required'   => false,
            'max_length' => 30,
            'type'       => 'tel',
        ],
        'email' => [
            'label'      => 'メールアドレス',
            'required'   => true,
            'max_length' => 254,
            'type'       => 'email',
        ],
        'address' => [
            'label'      => '住所',
            'required'   => false,
            'max_length' => 500,
            'type'       => 'text',
        ],
        'message' => [
            'label'      => 'お問い合わせ内容',
            'required'   => true,
            'max_length' => 5000,
            'type'       => 'textarea',
        ],
    ];

    /**
     * お問い合わせフォームの入力項目定義を変更する。
     *
     * @param array<string, array{label: string, required: bool, max_length: int, type: string}> $fields
     */
    return (array) apply_filters('reactwp_contact_form_fields', $fields);
}

/**
 * $_POSTから入力値を取得し、サニタイズする。
 *
 * @param array<string, mixed> $raw
 * @return array<string, string>
 */
function reactwp_contact_sanitize_input(array $raw): array
{
    $values = [];

    foreach (reactwp_contact_form_fields() as $name => $field) {
        $raw_value = wp_unslash($raw[$name] ?? '');

        $values[$name] = $field['type'] === 'textarea'
            ? sanitize_textarea_field((string) $raw_value)
            : ($field['type'] === 'email'
                ? sanitize_email((string) $raw_value)
                : sanitize_text_field((string) $raw_value));
    }

    $values['privacy_agreement'] =
        isset($raw['privacy_agreement'])
        && (string) wp_unslash($raw['privacy_agreement']) === '1'
            ? '1'
            : '';

    return $values;
}

/**
 * メールアドレスに改行等が含まれていないか確認する。
 * (ヘッダーインジェクション対策)
 */
function reactwp_contact_is_safe_header_value(string $value): bool
{
    return !preg_match('/[\r\n]/', $value);
}

/**
 * サーバー側バリデーション。JSバリデーションと同じ条件で再検証する。
 *
 * @param array<string, string> $values
 * @return array<string, string> フィールド名をキーとしたエラーメッセージ
 */
function reactwp_contact_validate(array $values): array
{
    $errors = [];

    foreach (reactwp_contact_form_fields() as $name => $field) {
        $value = trim((string) ($values[$name] ?? ''));

        if ($field['required'] && $value === '') {
            $errors[$name] = sprintf('%sを入力してください。', $field['label']);
            continue;
        }

        if ($value === '') {
            continue;
        }

        if (mb_strlen($value) > $field['max_length']) {
            $errors[$name] = sprintf(
                '%sは%d文字以内で入力してください。',
                $field['label'],
                $field['max_length']
            );
            continue;
        }

        if ($field['type'] === 'email') {
            if (!is_email($value)) {
                $errors[$name] = '正しいメールアドレスを入力してください。';
                continue;
            }

            if (!reactwp_contact_is_safe_header_value($value)) {
                $errors[$name] = '正しいメールアドレスを入力してください。';
                continue;
            }
        }
    }

    $privacy_agreement = ($values['privacy_agreement'] ?? '') === '1';

    if (!$privacy_agreement) {
        $errors['privacy_agreement'] = '個人情報の取り扱いへの同意が必要です。';
    }

    $url_count = reactwp_contact_count_urls((string) ($values['message'] ?? ''));

    if ($url_count > REACTWP_CONTACT_MAX_URLS) {
        $errors['message'] = sprintf(
            'URLの数が多すぎます。%d件以内にしてください。',
            REACTWP_CONTACT_MAX_URLS
        );
    }

    /**
     * サーバー側バリデーション結果を変更する。
     *
     * @param array<string, string> $errors
     * @param array<string, string> $values
     */
    return (array) apply_filters('reactwp_contact_validate_errors', $errors, $values);
}
