import type { Directive } from 'vue';
import { nextTick } from 'vue';

let activeWindow: HTMLElement | null = null;
const positions = new WeakMap<HTMLElement, { left: string; top: string }>();
let highestZIndex = 1000; // Starting z-index

export const draggable: Directive<HTMLElement, string> = {
  async mounted(el, binding) {
    await nextTick();
    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return;

    const handle = el.querySelector<HTMLElement>(binding.value);
    if (!handle) {
      console.warn('v-draggable: handle not found:', binding.value);
      return;
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.style.position = 'absolute';

    // Initialize z-index
    if (!el.style.zIndex) {
      el.style.zIndex = String(highestZIndex++);
    }

    const savedPos = positions.get(el);
    if (savedPos) {
      el.style.left = savedPos.left;
      el.style.top = savedPos.top;
    } else if (!el.style.left && !el.style.top) {
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      el.style.left = `${rect.left - parentRect.left}px`;
      el.style.top = `${rect.top - parentRect.top}px`;
      positions.set(el, { left: el.style.left, top: el.style.top });
    }

    handle.style.cursor = 'grab';
    handle.style.userSelect = 'none';
    handle.style.touchAction = 'none';

    const setActiveWindow = () => {
      if (activeWindow && activeWindow !== el) {
        activeWindow.classList.remove('active');
      }
      activeWindow = el;
      el.classList.add('active');

      // Bring to front by setting highest z-index
      el.style.zIndex = String(++highestZIndex);
    };

    // Click anywhere in window to activate
    const onWindowClick = () => {
      setActiveWindow();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.target !== handle && !handle.contains(e.target as Node)) return;

      dragging = true;
      el.classList.add('dragging');
      setActiveWindow();

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      handle.setPointerCapture(e.pointerId);
      handle.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      const parentRect = parent.getBoundingClientRect();
      el.style.left = `${e.clientX - parentRect.left - offsetX}px`;
      el.style.top = `${e.clientY - parentRect.top - offsetY}px`;
      positions.set(el, { left: el.style.left, top: el.style.top });
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      el.classList.remove('dragging');
      handle.releasePointerCapture(e.pointerId);
      handle.style.cursor = 'grab';
    };

    // Add click listener to entire window
    el.addEventListener('mousedown', onWindowClick);
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
  },
};
