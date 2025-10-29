const doc = document as any;
const docEl = document.documentElement as any;

export function isFullscreen(): boolean {
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
}

export function toggleFullscreen(): void {
  if (isFullscreen()) {
    doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.() ?? doc.msExitFullscreen?.();
  } else {
    docEl.requestFullscreen?.() ??
      docEl.webkitRequestFullscreen?.() ??
      docEl.msRequestFullscreen?.();
  }
}
