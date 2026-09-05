import type { OriginalBlockRenderer } from '../types.js';

/**
 * <form>タグ自体・nonce・admin-post.php送信先はPHP側の
 * render_callback(reactwp_render_contact_form)が組み立てる。
 * ここでは中身(入力欄・パネル等)をそのまま出力し、
 * reactwp/contact-formブロックとして包むだけにする。
 */
export const renderContactForm: OriginalBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};

  if (typeof props.className === 'string') {
    attrs.className = props.className;
  }

  const inner = context.renderNode(props.children);

  return [
    context.openBlockComment('reactwp/contact-form', attrs),
    inner,
    context.closeBlockComment('reactwp/contact-form'),
  ].join('\n');
};
