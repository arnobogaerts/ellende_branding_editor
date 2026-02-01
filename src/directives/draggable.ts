import type { Directive } from 'vue';
import { nextTick } from 'vue';

let activeWindow: HTMLElement | null = null;
const positions = new WeakMap<HTMLElement, { left: string; top: string }>();
let highestZIndex = 1000;
export const draggable: Directive<HTMLElement, string> = {
  async mounted(el, binding) {
    await nextTick();
    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return;

    const handle = binding.value ? el.querySelector<HTMLElement>(binding.value) : el;
    if (!handle) {
      console.warn('v-draggable: handle not found:', binding.value);
      return;
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.style.position = 'absolute';

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

    handle.classList.add('grab');
    handle.style.userSelect = 'none';
    handle.style.touchAction = 'none';

    const setActiveWindow = () => {
      if (activeWindow && activeWindow !== el) {
        activeWindow.classList.remove('active');
      }
      activeWindow = el;
      el.classList.add('active');

      el.style.zIndex = String(++highestZIndex);
    };

    const onWindowClick = () => {
      setActiveWindow();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.target !== handle && !handle.contains(e.target as Node)) return;

      dragging = true;
      el.classList.add('dragging');
      setActiveWindow();

      handle.style.cursor = 'var(--cursor-grab)';
      document.body.style.cursor = 'var(--cursor-grab)';

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      handle.setPointerCapture(e.pointerId);

      handle.classList.remove('grab');
      handle.classList.add('grabbing');
    };

    function clamp(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max);
    }

    const SAFE_MARGIN_WIDTH = 10;
    const SAFE_MARGIN_HEIGHT = 30;

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // proposed new position
      let nextLeft = e.clientX - parentRect.left - offsetX;
      let nextTop = e.clientY - parentRect.top - offsetY;

      // max positions, reduced by safe margin
      const maxLeft = parentRect.width - elRect.width - SAFE_MARGIN_WIDTH;
      const maxTop = parentRect.height - elRect.height - SAFE_MARGIN_HEIGHT;
      // clamp positions inside safe margin
      nextLeft = clamp(nextLeft, SAFE_MARGIN_WIDTH, maxLeft);
      nextTop = clamp(nextTop, SAFE_MARGIN_HEIGHT, maxTop);

      el.style.left = `${nextLeft}px`;
      el.style.top = `${nextTop}px`;

      positions.set(el, {
        left: el.style.left,
        top: el.style.top,
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;

      dragging = false;
      el.classList.remove('dragging');
      handle.releasePointerCapture(e.pointerId);
      handle.classList.remove('grabbing');
      handle.classList.add('grab');

      handle.style.cursor = '';
      document.body.style.cursor = '';
    };

    el.addEventListener('mousedown', onWindowClick);
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
  },
};
