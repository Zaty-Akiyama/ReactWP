(() => {
  'use strict';

  const ROOT_SELECTOR = '[data-site-navigation]';
  const TOGGLE_SELECTOR = '[data-site-navigation-toggle]';
  const PANEL_SELECTOR = '[data-site-navigation-panel]';
  const OVERLAY_SELECTOR = '[data-site-navigation-overlay]';

  const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
  const mobileMedia = window.matchMedia(
    MOBILE_MEDIA_QUERY,
  );

  /**
   * ナビゲーションの開閉状態を変更する。
   *
   * @param {HTMLElement} navigation
   * @param {boolean} isOpen
   */
  function setNavigationState(navigation, isOpen) {
    const toggle = navigation.querySelector(
      TOGGLE_SELECTOR,
    );

    const panel = navigation.querySelector(
      PANEL_SELECTOR,
    );

    if (
      !(toggle instanceof HTMLButtonElement) ||
      !(panel instanceof HTMLElement)
    ) {
      return;
    }

    /**
     * PCではナビゲーションを常時操作可能にする。
     */
    if (!mobileMedia.matches) {
      navigation.classList.remove('is-open');

      toggle.setAttribute(
        'aria-expanded',
        'true',
      );

      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('inert');

      syncScrollLock();

      return;
    }

    /**
     * 閉じる前にパネル内からフォーカスを逃がす。
     */
    if (
      !isOpen &&
      panel.contains(document.activeElement)
    ) {
      toggle.focus();
    }

    navigation.classList.toggle(
      'is-open',
      isOpen,
    );

    toggle.setAttribute(
      'aria-expanded',
      isOpen ? 'true' : 'false',
    );

    panel.setAttribute(
      'aria-hidden',
      isOpen ? 'false' : 'true',
    );

    panel.toggleAttribute(
      'inert',
      !isOpen,
    );

    const openLabel =
      toggle.dataset.openLabel || 'メニューを開く';

    const closeLabel =
      toggle.dataset.closeLabel || 'メニューを閉じる';

    toggle.setAttribute(
      'aria-label',
      isOpen ? closeLabel : openLabel,
    );

    syncScrollLock();
  }

  /**
   * PC・SPモード切り替え時はアニメーションさせずに状態を同期する。
   *
   * @param {HTMLElement} navigation
   */
  function syncSingleNavigationMode(navigation) {
    navigation.classList.add('is-switching-mode');

    setNavigationState(navigation, false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navigation.classList.remove('is-switching-mode');
      });
    });
  }

  /**
   * 開閉状態を反転する。
   *
   * @param {HTMLElement} navigation
   */
  function toggleNavigation(navigation) {
    if (!mobileMedia.matches) {
      return;
    }

    const toggle = navigation.querySelector(
      TOGGLE_SELECTOR,
    );

    if (!(toggle instanceof HTMLButtonElement)) {
      return;
    }

    const isOpen =
      toggle.getAttribute('aria-expanded') === 'true';

    setNavigationState(
      navigation,
      !isOpen,
    );
  }

  /**
   * 画面内の開いているナビゲーションに応じて
   * 背景スクロールを制御する。
   */
  function syncScrollLock() {
    const hasOpenNavigation =
      mobileMedia.matches &&
      Array.from(
        document.querySelectorAll(ROOT_SELECTOR),
      ).some((navigation) => {
        return navigation.classList.contains(
          'is-open',
        );
      });

    document.documentElement.classList.toggle(
      'has-reactwp-site-navigation-open',
      hasOpenNavigation,
    );
  }

  /**
   * トグルボタンのクリック。
   */
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const toggle = event.target.closest(
      TOGGLE_SELECTOR,
    );

    if (!(toggle instanceof HTMLButtonElement)) {
      return;
    }

    const navigation = toggle.closest(
      ROOT_SELECTOR,
    );

    if (!(navigation instanceof HTMLElement)) {
      return;
    }

    toggleNavigation(navigation);
  });

  /**
   * Escapeキーで閉じる。
   */
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    document
      .querySelectorAll(ROOT_SELECTOR)
      .forEach((navigation) => {
        if (!(navigation instanceof HTMLElement)) {
          return;
        }

        if (
          !navigation.classList.contains('is-open')
        ) {
          return;
        }

        setNavigationState(
          navigation,
          false,
        );

        const toggle = navigation.querySelector(
          TOGGLE_SELECTOR,
        );

        if (toggle instanceof HTMLButtonElement) {
          toggle.focus();
        }
      });
  });

  /**
   * 背景またはメニュー内リンクをクリックしたら閉じる。
   */
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    /**
     * 背景クリック
     */
    const overlay = event.target.closest(
      OVERLAY_SELECTOR,
    );

    if (overlay instanceof HTMLElement) {
      const navigation = overlay.closest(
        ROOT_SELECTOR,
      );

      if (navigation instanceof HTMLElement) {
        setNavigationState(
          navigation,
          false,
        );
      }

      return;
    }

    /**
     * メニュー内リンククリック
     */
    const link = event.target.closest(
      `${ROOT_SELECTOR} a`,
    );

    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const navigation = link.closest(
      ROOT_SELECTOR,
    );

    if (!(navigation instanceof HTMLElement)) {
      return;
    }

    setNavigationState(
      navigation,
      false,
    );
  });

  /**
   * 現在の画面幅に合わせて状態を同期する。
   */
  function syncAllNavigationModes() {
    document
      .querySelectorAll(ROOT_SELECTOR)
      .forEach((navigation) => {
        if (!(navigation instanceof HTMLElement)) {
          return;
        }

        syncSingleNavigationMode(navigation);
      });
  }

  /**
   * 初期状態。
   */
  syncAllNavigationModes();

  mobileMedia.addEventListener(
    'change',
    syncAllNavigationModes,
  );
})();