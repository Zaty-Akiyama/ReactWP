import type { CoreBlockRenderer } from '../types.js';

export const renderNavigation: CoreBlockRenderer = (props, context) => {
  const attrs: Record<string, unknown> = {};

  if (props.className) {
    attrs.className = props.className;
  }

  if (props.overlayMenu) {
    attrs.overlayMenu = props.overlayMenu;
  }

  attrs.layout = {
    type: 'flex',
    orientation: props.orientation ?? 'horizontal',
    ...(props.justifyContent
      ? { justifyContent: props.justifyContent }
      : {}),
  };

  return [
    context.openBlockComment('navigation', attrs),
    context.renderNode(props.children),
    context.closeBlockComment('navigation'),
  ].join('\n');
};

export const renderNavigationLink: CoreBlockRenderer = (props) => {
  const attrs: Record<string, unknown> = {
    label: props.label,
    url: props.url,
    kind: props.kind ?? 'custom',
    isTopLevelLink: true,
  };

  if (props.className) {
    attrs.className = props.className;
  }

  if (props.opensInNewTab !== undefined) {
    attrs.opensInNewTab = props.opensInNewTab;
  }

  if (props.rel) {
    attrs.rel = props.rel;
  }

  return `<!-- wp:navigation-link ${JSON.stringify(attrs)} /-->`;
};
