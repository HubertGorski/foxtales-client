export function disableScroll(): void {
  if (typeof document === "undefined") return;

  const listener = (e: Event) => {
    e.preventDefault();
  };

  document.addEventListener(
    "touchmove",
    listener as EventListener,
    { passive: false } as AddEventListenerOptions
  );
}

export function enableScroll(): void {
  const listener = (e: Event) => {
    e.preventDefault();
  };

  document.removeEventListener(
    "touchmove",
    listener as EventListener,
    { passive: false } as AddEventListenerOptions
  );
}
