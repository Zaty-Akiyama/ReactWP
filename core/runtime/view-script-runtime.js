"use strict";
(() => {
  // core/runtime/_src/view-script-runtime.ts
  (() => {
    if (window.ReactWPRuntime) {
      return;
    }
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    window.ReactWPRuntime = { reducedMotion: reduceMotionQuery.matches };
  })();
})();
