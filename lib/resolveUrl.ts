import { escapeAttr } from './escapeAttr.js';

type ResolvedUrl = {
  blockValue: string;
  htmlValue: string;
};

/**
 * 相対パスかどうかを判定する
 *
 * assets/images/example.jpg → テーマ内画像
 * ./assets/images/example.jpg → テーマ内画像
 *
 * https://example.com/image.jpg → そのまま
 * /wp-content/uploads/image.jpg → そのまま
 * data:image/... → そのまま
 */
function isThemeAssetPath(value: string): boolean {
  if (!value) {
    return false;
  }

  return !/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(value);
}

function escapePhpSingleQuotedString(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'");
}

export function resolveUrl(value: string): ResolvedUrl {
  if (!isThemeAssetPath(value)) {
    return {
      blockValue: value,
      htmlValue: escapeAttr(value),
    };
  }

  const themePath = value.replace(/^\.\//, '');

  if (themePath.split('/').includes('..')) {
    throw new Error(`Theme asset path cannot contain "..": ${value}`);
  }

  const escapedPath = escapePhpSingleQuotedString(themePath);

  const phpUrl =
    `<?php echo esc_url( get_theme_file_uri( '${escapedPath}' ) ); ?>`;

  return {
    blockValue: phpUrl,
    // PHPタグをescapeAttr()に通すと実行されなくなるため、そのまま返す
    htmlValue: phpUrl,
  };
}