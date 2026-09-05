export {};

declare global {
  interface Window {
    ReactWPRuntime?: {
      reducedMotion: boolean;
    };
  }
}

(() => {
  if (window.ReactWPRuntime) {
    return;
  }

  const reduceMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );

  window.ReactWPRuntime = { reducedMotion: reduceMotionQuery.matches };
})();
