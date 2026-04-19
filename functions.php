<?php

function reactwp_enqueue_patterns_css() {
    $css_file = get_template_directory() . '/styles/patterns.css';
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'reactwp-patterns',
            get_template_directory_uri() . '/styles/patterns.css',
            [],
            (string) filemtime($css_file)
        );
    }
}

add_action('enqueue_block_assets', 'reactwp_enqueue_patterns_css');
