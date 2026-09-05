<?php

defined('ABSPATH') || exit;

/**
 * useViewScript()で生成されたフロント用JSを、対象パターンが
 * 実際に存在するページだけで読み込むためのレンダーコールバック。
 *
 * ブロックの描画(do_blocks)はwp_head()より前に走るため、ここでは
 * wp_enqueue_script()を直接呼ばず、対象の識別名を記録するだけにする。
 * 実際のenqueueはwp_enqueue_scriptsフック側でまとめて行う。
 * このブロック自体はHTMLを一切出力しない。
 */
function reactwp_render_view_script(array $attributes): string
{
    // エディター内ではフロント用スクリプトを実行しない
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return '';
    }

    $name = $attributes['name'] ?? '';

    if ($name === '') {
        return '';
    }

    global $reactwp_active_view_scripts;

    if (!is_array($reactwp_active_view_scripts)) {
        $reactwp_active_view_scripts = [];
    }

    $reactwp_active_view_scripts[$name] = true;

    return '';
}

/**
 * reactwp_render_view_script()が記録した識別名を元に、
 * 実際にwp_enqueue_script()を行う。
 */
function reactwp_enqueue_active_view_scripts(): void
{
    global $reactwp_active_view_scripts;

    if (empty($reactwp_active_view_scripts)) {
        return;
    }

    $manifest_path = get_theme_file_path('assets/generated/view-scripts/manifest.json');

    if (!is_readable($manifest_path)) {
        return;
    }

    $manifest = json_decode((string) file_get_contents($manifest_path), true);

    if (!is_array($manifest)) {
        return;
    }

    $runtime_file       = get_theme_file_path('core/runtime/view-script-runtime.js');
    $runtime_registered = false;

    foreach (array_keys($reactwp_active_view_scripts) as $name) {
        if (!isset($manifest[$name]['file'])) {
            continue;
        }

        $entry       = $manifest[$name];
        $script_path = get_theme_file_path($entry['file']);

        if (!is_readable($script_path)) {
            continue;
        }

        if (!$runtime_registered && is_readable($runtime_file)) {
            wp_register_script(
                'reactwp-view-script-runtime',
                get_theme_file_uri('core/runtime/view-script-runtime.js'),
                [],
                (string) filemtime($runtime_file),
                true
            );
            $runtime_registered = true;
        }

        wp_enqueue_script(
            'reactwp-view-script-' . $name,
            get_theme_file_uri($entry['file']),
            ['reactwp-view-script-runtime'],
            (string) ($entry['version'] ?? filemtime($script_path)),
            true
        );
    }
}
