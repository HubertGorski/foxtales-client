// src/composables/useForceTopOnScroll.ts
import { onMounted, onBeforeUnmount } from "vue";

type Options = {
  cooldownMs?: number; // czas między kolejnymi wymuszeniami
  minDelta?: number; // minimalna wartość delta, uznajemy za "scroll down"
  ignoreSelector?: string; // selector do elementów, gdzie nie chcemy aktywować (np. '.no-force-scroll')
};

export function useForceTopOnScroll(options: Options = {}) {
  const { cooldownMs = 300, minDelta = 8, ignoreSelector } = options;
  let lastTriggered = 0;
  let touchStartY: number | null = null;

  const isInputFocused = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      (el as HTMLElement).isContentEditable
    );
  };

  const isInIgnored = (target: EventTarget | null) => {
    if (!ignoreSelector || !(target instanceof Element)) return false;
    return !!target.closest(ignoreSelector);
  };

  const tryForceTop = () => {
    const now = Date.now();
    if (now - lastTriggered < cooldownMs) return;
    const scrollEl = document.scrollingElement || document.documentElement;
    if (!scrollEl) return;
    if (scrollEl.scrollTop === 0) return;
    // wymuszamy natychmiast:
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    lastTriggered = now;
  };

  const onWheel = (e: WheelEvent) => {
    if (isInputFocused()) return;
    if (isInIgnored(e.target)) return;
    // deltaY > 0 = scroll down
    if (e.deltaY > minDelta) {
      tryForceTop();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (isInputFocused()) return;
    if (isInIgnored(e.target)) return;
    if (!touchStartY || !e.touches || e.touches.length === 0) return;
    const curY = e.touches[0].clientY;
    const dy = touchStartY - curY; // dodatnie = palec przesunięty w górę => treść przesuwa się w dół
    if (dy > minDelta) {
      tryForceTop();
      // opcjonalnie: aby zapobiec dalszemu scrollowaniu natywnemu, możemy zapobiec default
      // e.preventDefault() // UWAGA: wymaga { passive: false } przy addEventListener
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (isInputFocused()) return;
    const keysDown = ["ArrowDown", "PageDown", " " /* Space */];
    if (keysDown.includes(e.key)) {
      tryForceTop();
    }
  };

  onMounted(() => {
    // wheel
    window.addEventListener("wheel", onWheel, { passive: true });

    // touch (nie ustawiam passive:false domyślnie, bo nie chcemy blokować scrolla systemowo)
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // klawiatura
    window.addEventListener("keydown", onKeyDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeyDown);
  });
}
